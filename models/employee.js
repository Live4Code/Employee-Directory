import mongoose from 'mongoose';

var EmployeeSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  title: {
    type: String
  },
  department: {
    type: String
  },
  mobilePhone: {
    type: String
  },
  officePhone: {
    type: String
  },
  email: {
    type: String
  },
  city: {
    type: String
  },
  pic: {
    type: String
  },
  twitterId: {
    type: String
  },
  blog: {
    type: String
  },
  reports: {
    type: Number
  },
  manager: {
    type: Number
  }
});

/* take care by graphql
EmployeeSchema.pre('find', (next) => {
  this.populate('manager', 'firstName lastName');
  next();
});

EmployeeSchema.virtual('managerName').get(() => {
  return this.manager.firstName + ' ' + this.manager.lastName;
}); */

var Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
