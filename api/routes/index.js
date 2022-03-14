var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const got = require("got")

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
//const ref = db.ref('users');

router.post('/createNewSet', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  if (req.body.userUID) {
    let postRef = db.ref('users/' + req.body.userUID + '/posts').push()
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
      res.header("Access-Control-Allow-Origin", "*");
      let postRef = db.ref('users/' + req.body.userUID + '/posts/' + req.body.firebaseId)

      postRef.update(req.body.cardData)
      return res.send('success')
    }
  })


/* GET home page. */
router.get('/getSong', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  let wikiUrls = []
  rp(vgmUrl)
    .then(function (html) {
      const $ = cheerio.load(html);
      //console.log(html)
      //success!

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
    res.header('Access-Control-Allow-Origin', '*');
    //console.log(req.query.userUID)
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

    testArray.on("value", function (snapshot) {
      return res.status(200).send(snapshot.val())
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
  .get('/getTranslation', async function (req, res) {
    const text = 'Nimm, nimm, nimm von mir alles, was du brauchst';

    // The target language
    const target = 'en';

    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);
    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);
    res.status(200).send(translation)
  })



module.exports = router;

