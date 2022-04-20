var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const got = require("got")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

const fs = require('fs');
const { JSDOM } = require("jsdom")
const axios = require('axios')
const { getDatabase } = require('firebase-admin/database');
const { Translate } = require('@google-cloud/translate').v2;
// Get a database reference to our blog


const vgmUrl = 'https://genius.com/Jeremias-schon-okay-lyrics';

const projectId = 'crested-trilogy-344121';


// Imports the Google Cloud client library


// Instantiates a client
const translate = new Translate({ projectId, keyFilename: './routes/langmusikCloudAPI.json' });

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://langmusik-b09c6-default-rtdb.firebaseio.com"
});
const db = getDatabase();

router
  .post('/createNewSet', function (req, res, next) {
    if (req.body.userUID) {
      //todo: will need to handle all the data from data in Dashboard component.
      let postRef = db.ref('users/' + req.body.userUID + '/posts').push()
      console.log(req.body.title, req.body.description)
      //let postID = postRef.key
      let temp = req.body.value
      temp['id'] = postRef.key
      postRef.set(temp)
      res.status(200).send("success")
    } else {
      res.status(403).send('Unauthorized')
    }
  })
  .post('/addNewCard', function (req, res) {
    if (req.body.userUID) {
      let postRef = db.ref('users/' + req.body.userUID + '/posts/')
      postRef.child(req.body.firebaseId).update(req.body.cardData)
      return res.send('success')
    }
  })
  .post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:3000/newset",
      clientId: 'cb541a417f8b4516990ae7f2aa994ec0',
      clientSecret: '2789f2d1599d4a308ad8bdb07a23cf38',
      refreshToken,
    })

    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })
  .post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:3000/newset",
      clientId: 'cb541a417f8b4516990ae7f2aa994ec0',
      clientSecret: '2789f2d1599d4a308ad8bdb07a23cf38'
    })

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        })
      })
      .catch(err => {
        res.sendStatus(400)
      })
  })

router
  .get('/getSong', function (req, res, next) {
    let wikiUrls = []
    rp(vgmUrl)
      .then(function (html) {
        const $ = cheerio.load(html);

        //Need to find some way to add a more specific search for the music
        wikiUrls.push($('#lyrics-root', html).map(function (i, el) {
          // this === el
          let str = $(this).html().replace(/<br\s*\/?>/gi, '\n');

          return $(str).text()
        })
          .toArray())

        //console.log($('td > b > a', html).length);
        //console.log($('td > b > a', html));

        console.log(wikiUrls[0]);
        res.send(wikiUrls[0])
      })
      .catch(function (err) {
        //handle error
      });

  })
  .get('/getSets', function (req, res, next) {
    let testArray = db.ref('users/' + req.query.userUID + '/posts')

    testArray.once("value", function (snapshot) {
      var list = [];
      snapshot.forEach(function (elem) {
        console.log(elem.val())
        list.push(elem.val());
      });
      console.log(list)
      res.send(list)
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
  .get('/getSet', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    let testArray = db.ref('users/' + req.query.userUID + '/posts/' + req.query.firebaseId)

    testArray.once("value", function (snapshot) {
      return res.status(200).send(snapshot.val())
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
  .get('/getTranslation', async function (req, res) {
    // The target language
    //const target = 'en';

    // Translates some text into English
    const [translation] = await translate.translate(req.query.text, req.query.target);
    console.log(`Text: ${req.query.text}`);
    console.log(`Translation: ${translation}`);
    res.status(200).send(translation)
  })
  .get("/lyrics", async (req, res) => {
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
  })

module.exports = router;

