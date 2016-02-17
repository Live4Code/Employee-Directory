import {getSchema} from '@risingstack/graffiti-mongoose';
import graphql from 'graphql';
import Employee from './models/Employee';

const options = {
  mutation: false // mutation fields can be disabled
};

const Schema = getSchema([Employee], options);

export default Schema;
