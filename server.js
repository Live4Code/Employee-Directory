import koa from 'koa';
import Router from 'koa-router';
import qs from 'koa-qs';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import {graphql} from 'graphql';
import schema from './schema';

let port = process.env.PORT || 3000;
let routes = new Router();
var app = koa();
app.use(bodyParser());

// support nested query tring params
qs(app);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/graphql');
}

routes.get('/data', function* () {
  var query = this.query.query;
  var params = this.query.params;

  var resp = yield graphql(schema, query, '', params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

routes.post('/data', function* () {
  var payload = this.request.body;
  var resp = yield graphql(schema, payload.query, '', payload.params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

app.use(routes.middleware());

app.listen(port, () => {
  console.log('app is listening on ' + port);
});

module.exports = app;
