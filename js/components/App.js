import React from 'react';
import Relay from 'react-relay';
import EmployeeList from './EmployeeList';

class App extends React.Component {
  render() {
    const employees = this.props.viewer.employees.edges;
    return (
      <div className="content">
        <EmployeeList employees={employees}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        employees(first: 20) {
          edges {
            node {
              _id,
              firstName,
              lastName,
              title
            },
          },
        },
      }
    `,
  },
});
