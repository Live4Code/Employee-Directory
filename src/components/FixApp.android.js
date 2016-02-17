import React from 'react-native';
import Relay from 'react-relay';
import EmployeeListPage from './EmployeeListPage';
import EmployeePage from './EmployeePage';

var {
  Navigator,
  TouchableHighlight,
  StyleSheet,
  BackAndroid,
  ToolbarAndroid,
  View,
} = React;

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var FixApp = React.createClass({
  renderScene(route, navigator) {
    _navigator = navigator;
    switch (route.name) {
      case 'EmployeePage':
        return (
          <View style={{flex: 1}}>
            <ToolbarAndroid
              actions={[]}
              navIcon={require('image!android_back_white')}
              onIconClicked={navigator.pop}
              style={styles.toolbar}
              titleColor="white"
              title={route.employee.firstName+' '+route.employee.lastName} />
            <EmployeePage
              style={{flex: 1}}
              navigator={navigator}
              employee={route.employee}
            />
          </View>
        )
      default:
        return (
          <EmployeeListPage viewer={this.props.viewer} navigator={navigator} />
        )
    }
  },

  render() {
    const initialRoute = {name: 'search'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={this.renderScene}
      />
    );
  }
});

export default Relay.createContainer(FixApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${EmployeeListPage.getFragment('viewer')},
      }
    `,
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});
