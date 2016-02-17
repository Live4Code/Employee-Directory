/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import Employee from './models/employee';

function getProjection (fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;

    return projections;
  }, {});
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  Employee,
  getEmployee: (id) => Employee.findOne({id: id}),
  getAllEmployees: () => Employee.find({}),
  searchEmployees: (key) => Employee.find({$text: {$search: key, $caseSensitive: false}}),
};
