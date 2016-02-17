'use strict';
import React from 'react-native';
import Relay from 'react-relay';

var {
  ListView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

var SearchBar = require('SearchBar');
var EmployeeCell = require('./EmployeeCell');
var EmployeePage = require('./EmployeePage');

var EmployeeListPage = React.createClass({

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
    };
  },

  componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.viewer.search.edges),
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.viewer.search.edges),
    });
  },

  onSearchChange: function(event: Object) {
    var searchKey = event.nativeEvent.text.toLowerCase();
    this.props.relay.setVariables({
      q: searchKey
    });
  },

  selectEmployee: function(employee: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: employee.firstName + ' ' + employee.lastName,
        component: EmployeePage,
        passProps: {employee},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: employee.firstName + ' ' + employee.lastName,
        name: 'EmployeePage',
        employee: employee,
      });
    }
  },

  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  },

  renderRow: function(
    edge: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    const employee = edge.node;
    return (
      <EmployeeCell
        key={employee.id}
        onSelect={() => this.selectEmployee(employee)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        employee={employee}
      />
    );
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoEmployees
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
        />
        <View style={styles.separator} />
        {content}
      </View>
    );
  }
});

var NoEmployees = React.createClass({
  render: function() {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No employees found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noMoviesText}>{text}</Text>
      </View>
    );
  }
});

export default Relay.createContainer(EmployeeListPage, {
  initialVariables: {
    q: ''
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        search(q: $q, first:20) {
          edges {
            node {
              _id,
              firstName,
              lastName,
              title,
              pic
            },
          },
        },
      }
    `,
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});
