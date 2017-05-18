/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var path = require('path');
var hapi = require('hapi');
var nunjucks = require('nunjucks');

var CLIENT_DIR = path.join(__dirname, '..', 'client');
nunjucks.configure(CLIENT_DIR);

var HOST = '127.0.0.1';
var PORT = '8111';

var server = new hapi.Server();
server.connection({
  host: HOST,
  port: PORT
});

server.path(CLIENT_DIR);
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {

    nunjucks.render('index.html', {
      bodyClass: request.query.bodyClass || '',
      country: request.query.country,
      forceExperiment: request.query.forceExperiment,
      forceExperimentGroup: request.query.forceExperimentGroup,
      pathname: request.query.pathname || '',
    }, function (err, res) {
      reply(res);
    });
  }
});

server.route({
  method: 'GET',
  path: '/{filename}',
  handler: {
    file: function (request) {
      return request.params.filename;
    }
  }
});

server.start();
console.log('server running on ' + HOST + ':' + PORT);
