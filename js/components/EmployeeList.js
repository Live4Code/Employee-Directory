import React from 'react';
import EmployeeListItem from './EmployeeListItem';

class EmployeeList extends React.Component {
  render() {
    var items = this.props.employees.map(function (employeeEdge) {
      const employee = employeeEdge.node;
      return (
        <EmployeeListItem key={employee._id} employee={employee} />
      );
    });
    return (
      <ul className="table-view">
        {items}
      </ul>
    );
  }
}

export default EmployeeList;
