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

// Get a database reference to our blog


const vgmUrl = 'https://genius.com/Jeremias-blaue-augen-lyrics';

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
    let postID = postRef.key
    postRef.set(['test', 'anotherkey', postID])

    let testArray = db.ref('users/' + req.body.userUID + '/posts/-MwTTrTXaTE2NVS_aAxs')
    testArray.on('value', (snapshot) => {
      let temp = snapshot.val()
      
      //let updatedTemp = temp.push("testttttt")
      console.log(updatedTemp)
      //testArray.set(updatedTemp)
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
    }); 

   

    res.status(200).send("success")
  } else {
    res.status(403).send('Unauthorized')
  }
})


/* GET home page. */
router.get('/getSong', function (req, res, next) {

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

      console.log(wikiUrls);
      res.send(wikiUrls)
    })
    .catch(function (err) {
      //handle error
    });

})

router.get('/getSet', function (req, res, next) {
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
      .then(() => {
        var database = admin.database()
        var uid = req.query.uid
        db.ref('/users/' + uid).once('value')
          .then(function (snapshot) {
            var data = snapshot.val() ? snapshot.val() : []
            res.status(200).send({ our_data: data })
          }).catch(function (error) {
            res.status(500).json({ error: error })
          })
      }).catch(() => {
        res.status(403).send('Unauthorized')
      })
  } else {
    res.status(403).send('Unauthorized')
  }
})

module.exports = router;

