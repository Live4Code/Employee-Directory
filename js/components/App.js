import React from 'react';
import Relay from 'react-relay';
import EmployeeList from './EmployeeList';

class App extends React.Component {

  handleChange(e) {
    const q  = e.target.value;
    this.props.relay.setVariables({
      q: q
    });
  }

  render() {
    const employees = this.props.viewer.search.edges;
    return (
      <div className="content">
      <input
        type="text"
        placeholder="search"
        onChange={this.handleChange.bind(this)}
        />
        <EmployeeList employees={employees}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    q: ''
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        search(q: $q, first: 20) {
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
