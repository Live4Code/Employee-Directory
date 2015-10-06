import {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLID
} from 'graphql';

import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import co from 'co';
import Employee from './models/employee';

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
function getProjection (fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;

    return projections;
  }, {});
}

var ValidateStringType = (params) => {
  return new GraphQLScalarType({
    name: params.name,
    serialize: value => {
      return value;
    },
    parseValue: value => {
      return value;
    },
    parseLiteral: ast => {
      console.log(ast);
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError("Query error: Can only parse strings got a: " + ast.kind, [ast]);
      }
      if (ast.value.length < params.min) {
        throw new GraphQLError(`Query error: minimum length of ${params.min} required: `, [ast]);
      }
      if (ast.value.length > params.max){
        throw new GraphQLError(`Query error: maximum length is ${params.max}: `, [ast]);
      }
      if(params.regex !== null) {
        if(!params.regex.test(ast.value)) {
          throw new GraphQLError(`Query error: Not a valid ${params.name}: `, [ast]);
        }
      }
      return ast.value;
    }
  })
};

var EmailType = ValidateStringType({
  name: 'Email',
  min: 4,
  max: 254,
  regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
});

var employeeType = new GraphQLObjectType({
  name: 'Employee',
  description: 'Employee creator',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the employee.',
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
        var projections = getProjection(fieldASTs);
        return Employee.findOne({id: user.manager}, projections);
      },
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
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
          var projections = getProjection(fieldASTs);
          console.log(projections);
          return Employee.findOne({id: id}, projections);
        }
      }
    }
  }),

  // mutation
  /*
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: userType,
        args: {
          name: {
            name: 'name',
            type: GraphQLString
          }
        },
        resolve: (obj, {name}, source, fieldASTs) => co(function *() {
          var projections = getProjection(fieldASTs);

          var user = new User();
          user.name = name;


          return yield user.save();
        })
      },
      deleteUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}, source, fieldASTs) => co(function *() {
          var projections = getProjection(fieldASTs);
          console.log(id);
          return yield User.findOneAndRemove({_id: id});
        })
      },
      updateUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            name: 'name',
            type: GraphQLString
          }
        },
        resolve: (obj, {id, name}, source, fieldASTs) => co(function *() {
          var projections = getProjection(fieldASTs);

          yield User.update({
            _id: id
          }, {
            $set: {
              name: name
            }
          });

          return yield User.findById(id, projections);
        })
      }
    }
  }) */
});

export var getProjection;
export default schema;
