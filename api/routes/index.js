var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const got = require("got")

const fs = require('fs');
const { JSDOM } = require("jsdom")
const axios = require('axios')

const vgmUrl = 'https://genius.com/Jeremias-blaue-augen-lyrics';

/* GET home page. */
router.get('/', function (req, res, next) {
  let wikiUrls = []
  rp(vgmUrl)
    .then(function (html) {
      const $ = cheerio.load(html);
      console.log(html)
      //success!

      //Need to find some way to add a more specific search for the music
      wikiUrls.push($('#lyrics-root', html).map(function (i, el) {
        // this === el
        return $(this).html()
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

});

module.exports = router;

