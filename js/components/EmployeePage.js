import React from 'react';
import Relay from 'react-relay';

class EmployeePage extends React.Component {
  render() {
    const employee = this.props.viewer.employee;
    return (
      <div className={"page " + this.props.position}>
        <div className="card">
          <ul className="table-view">
            <li className="table-view-cell media">
              <img className="media-object big pull-left" src={"pics/" + employee.firstName + "_" + employee.lastName + ".jpg" }/>
              <h1>{employee.firstName} {employee.lastName}</h1>
              <p>{employee.title}</p>
            </li>
            <li className="table-view-cell media">
              <a href={"tel:" + employee.officePhone} className="push-right">
                <span className="media-object pull-left icon icon-call"></span>
                <div className="media-body">
                  Call Office
                  <p>{employee.officePhone}</p>
                </div>
              </a>
            </li>
            <li className="table-view-cell media">
              <a href={"tel:" + employee.mobilePhone} className="push-right">
                <span className="media-object pull-left icon icon-call"></span>
                <div className="media-body">
                  Call Mobile
                  <p>{employee.mobilePhone}</p>
                </div>
              </a>
            </li>
            <li className="table-view-cell media">
              <a href={"sms:" + employee.mobilePhone} className="push-right">
                <span className="media-object pull-left icon icon-sms"></span>
                <div className="media-body">
                  SMS
                  <p>{employee.mobilePhone}</p>
                </div>
              </a>
            </li>
            <li className="table-view-cell media">
              <a href={"mailto:" + employee.email} className="push-right">
                <span className="media-object pull-left icon icon-email"></span>
                <div className="media-body">
                  Email
                  <p>{employee.email}</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default  Relay.createContainer(EmployeePage, {
  initialVariables: {
    employeeId: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        employee(id: $employeeId) {
          firstName,
          lastName,
          mobilePhone,
          officePhone,
          email,
          title
        }
      },
    `,
  }
});
