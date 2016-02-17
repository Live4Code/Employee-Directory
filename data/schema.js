/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';


import {
  // Import methods that your schema can use to interact with your database
  Employee,
  getEmployee,
  getAllEmployees,
  searchEmployees,
} from './database';

// the empty root object
// babel-node mangles subclasses, instanceof checks failing in the nodeDefinitions
class User {}
const viewer = new User();

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Employee') {
      return getEmployee(id);
    } else if (type === 'User') {
      return viewer;
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Employee) {
      return employeeType;
    } else if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

/**
 * use User as the root query
 */
 var userType = new GraphQLObjectType({
   name: 'User',
   description: 'Interface to get User specified and generic data',
   fields: () => ({
     id: globalIdField('User'),
     employees: {
       type: employeeConnection,
       description: 'All employees in the database',
       args: connectionArgs,
       resolve: (_, args) => connectionFromPromisedArray(getAllEmployees(), args),
     },
     employee: {
       type: employeeType,
       args: {
         id: {
           name: 'id',
           type: new GraphQLNonNull(GraphQLString)
         }
       },
       resolve: (root, {id}, source, fieldASTs) => {
         return getEmployee(id);
       }
     },
     search: {
       type: employeeConnection,
       description: 'Search employees in  the database',
       args: {
         ...connectionArgs,
         q: {
           name: 'q',
           type: GraphQLString
         }
       },
       resolve: (root, args, source, fieldASTs) => {
         if (!args.q) {
           return connectionFromPromisedArray(getAllEmployees(), args);
         }
         return connectionFromPromisedArray(searchEmployees(args.q),args);
       }
     }
   }),
   interfaces: [nodeInterface],
 });

var employeeType = new GraphQLObjectType({
  name: 'Employee',
  description: 'A employee in our app',
  fields: () => ({
    id: globalIdField('Employee'), //id is reserved
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id attribute of the employee in model',
      resolve: (user, params, source, fieldASTs) => {
        return user.id;
      },
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The first name of the employee.',
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The last name of the employee.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the employee',
    },
    department: {
      type: GraphQLString,
      description: 'The department name of the employee',
    },
    mobilePhone: {
      type: GraphQLString,
      description: 'The mobile phone number of the employee',
    },
    officePhone: {
      type: GraphQLString,
      description: 'The office phone number of the employee',
    },
    email: {
      type: GraphQLString,
      description: 'The email address of the employee',
    },
    city: {
      type: GraphQLString,
      description: 'The city of the employee',
    },
    pic: {
      type: GraphQLString,
      description: 'The url of the employee\'s picture',
    },
    twitterId: {
      type: GraphQLString,
      description: 'The twitter Id of the employee',
    },
    blog: {
      type: GraphQLString,
      description: 'The blog url of the employee',
    },
    reports: {
      type: GraphQLInt,
      description: 'The number of people report to the employee',
    },
    manager: {
      type: employeeType,
      description: 'The manager of the employee, or null if they have none.',
      resolve: (user, params, source, fieldASTs) => {
        return getEmployee(user.manager);
      },
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: employeeConnection} =
  connectionDefinitions({name: 'Employee', nodeType: employeeType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => viewer,
    }
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
