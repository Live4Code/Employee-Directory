import React from 'react';
import { Link } from 'react-router'

class EmployeeListItem extends React.Component {
  render() {
    return (
      <li className="table-view-cell media">
        <Link to={`/employees/${this.props.employee._id}`}>
          <img className="media-object small pull-left" src={"pics/" + this.props.employee.firstName + "_" + this.props.employee.lastName + ".jpg" }/>
          {this.props.employee.firstName} {this.props.employee.lastName}
          <p>{this.props.employee.title}</p>
        </Link>
      </li>
    );
  }
}

export default EmployeeListItem;
