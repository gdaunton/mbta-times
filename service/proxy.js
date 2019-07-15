var express = require('express');
var request = require('request');
require('dotenv').config();
var app = express();
const port = 8000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const BASE_URL = 'https://api-v3.mbta.com';

app.get('/routes/:id', function(req, res, next) {
  next();
});

app.param('id', function(req, res, next, id) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  request(
    `${BASE_URL}/routes/${id}`,
    {
      gzip: true,
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'x-api-token': process.env.apiToken,
      },
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
      }
      res.header('Content-Type', 'application/json');
      res.send(body);
    },
  );
});
