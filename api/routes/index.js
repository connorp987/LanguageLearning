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
      
      postRef.update(req.body.cardData, (error)=> {
        if (error) {
          return res.status(403).send('bad')
        } else {
          return res.status(200).send('success')
        }
      })
    } else {
      res.end()
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
  .get('/getSet', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //console.log(req.query.userUID)
    let testArray = db.ref('users/' + req.query.userUID + '/posts/' + req.query.firebaseId)

    testArray.on("value", function (snapshot) {
      console.log(snapshot.val())

      return res.status(200).send(snapshot.val())
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })



module.exports = router;

