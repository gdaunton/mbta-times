var express = require('express');
var request = require('request');
var EventSource = require('eventsource');
require('dotenv').config();
var app = express();
const port = 8000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const BASE_URL = 'https://localhost:60103';

app.get('/routes/:id', function(req, res) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  request(
    `${BASE_URL}/routes/${req.params.id}`,
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

app.get('/predictions/:routeId/:stopId', (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
  });
  const source = new EventSource(
    `${BASE_URL}/predictions?filter[stop]=${req.params.stopId}&filter[route]=${req.params.routeId}`,
    {
      headers: {
        Accept: 'text/event-stream',
        'x-api-token': process.env.apiToken,
      },
    },
  );
  source.onmessage = function(event) {
    res.write(event.data);
  };
  source.onerror = function(event) {
    next(new Error(event.message));
  };
});

app.get(
  '/predictions/:routeId/:inboundStopId/:outboundStopId',
  (req, res, next) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
    });
    const source = new EventSource(
      `${BASE_URL}/predictions?filter[stop]=${req.params.inboundStopId},${req.params.outboundStopId}&filter[route]=${req.params.routeId}`,
      {
        headers: {
          Accept: 'text/event-stream',
          'x-api-token': process.env.apiToken,
        },
      },
    );

    source.onmessage = function(event) {
      res.write(event.data);
    };

    source.onerror = function(event) {
      next(new Error(event.message));
    };
  },
);
