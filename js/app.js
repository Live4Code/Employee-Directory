import 'babel-polyfill';

import App from './components/App';
import EmployeeList from './components/EmployeeList';
import EmployeePage from './components/EmployeePage';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import createHashHistory from 'history/lib/createHashHistory';
import { useRouterHistory } from 'react-router';
import {Route, IndexRoute} from 'react-router';
import {RelayRouter} from 'react-router-relay';

const history = useRouterHistory(createHashHistory)({ queryKey: false });

const viewerQueries = {
  viewer: () => Relay.QL`query { viewer }`,
};

ReactDOM.render(
  <RelayRouter history={history}>
    <Route path="/" component={App} queries={viewerQueries} />
    <Route path="employees/:employeeId" component={EmployeePage}
      queries={viewerQueries}
    />
  </RelayRouter>,
  document.getElementById('root')
);
