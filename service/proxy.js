var httpProxy = require('http-proxy');
var http = require('http');
var fs = require('fs');
var path = require('path');
require('dotenv').config();

const proxy = httpProxy.createProxyServer({
  target: {
    protocol: 'https:',
    host: 'api-v3.mbta.com',
    port: 443,
    pfx: fs.readFileSync(path.resolve(__dirname, './keyStore.p12')),
    passphrase: process.env.pfxPassphrase,
  },
  changeOrigin: true,
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('x-api-key', process.env.accessToken);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'cache-control');
});

var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, {
    target: 'https://api-v3.mbta.com',
  });
});

console.log('listening on port 8000');
server.listen(8000);
