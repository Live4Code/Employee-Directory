import koa from 'koa';
import Router from 'koa-router';
import qs from 'koa-qs';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import {graphql} from 'graphql';
import schema from './schema';
import serve from 'koa-static';
import mount from 'koa-mount';
import Employee from './models/employee';

let port = process.env.PORT || 3000;
let routes = new Router();
var app = koa();
app.use(bodyParser());

app.use(mount('/public', serve(__dirname+'/public')));

// support nested query tring params
qs(app);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://mongo:27017/graphql');
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

routes.get('/api/employees', function* () {
  var q = this.query.q || undefined;
  if (q) {
    var allEmployees = yield Employee.find({});
    var employees = allEmployees.filter((employee) => {
      var searchKey = employee.firstName + ' ' + employee.lastName + employee.title;
      return searchKey.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
  } else {
    var employees = yield Employee.find({});
  }
  var resp = {total : employees.length, employees: employees};
  this.body = resp;
});

routes.get('/api/employees/:id', function* (){
  var employee = yield Employee.findOne({id: this.params.id});
  this.body = employee;
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
