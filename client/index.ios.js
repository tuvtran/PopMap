/**
 * Safe Route Client App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  Image,
  MapView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

class RouteInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>from:</Text>
          <TextInput
            onChangeText={(text) => this.setState({from: text})}
            onSubmitEditing={(text) => this.refs.toInput.focus()}
            returnKeyType={'next'}
            style={styles.textInput}
            value={this.state.from} />
        </View>
        <View style={styles.row}>
          <Text>to:</Text>
          <TextInput
            ref='toInput'
            onChangeText={(text) => this.setState({to: text})}
            onSubmitEditing={(_) => this.requestRoute()}
            returnKeyType='route'
            style={styles.textInput}
            value={this.state.to} />
        </View>
      </View>
    );
  }

  requestRoute() {
    console.log('from: ' + this.state.from);
    console.log('to: ' + this.state.to);
  }
}

var SafeRoute = React.createClass({

  getInitialState() {
    return {
      isFirstLoad: true,
      mapRegion: undefined,
      annotations: [],
    };
  },

  render() {
    return (
      <View>
        <RouteInput />
        <MapView
          showsUserLocation={true}
          style={styles.map}
          onRegionChange={this._onRegionChange}
          onRegionChangeComplete={this._onRegionChangeComplete}
          region={this.state.mapRegion}
          annotations={this.state.annotations}
        />
      </View>
    );
  },

});

var styles = StyleSheet.create({
  map: {
    height: 300,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  row: {
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    flexDirection: 'row',
    paddingLeft: 6,
  },
  container: {
    paddingTop: 100,
  },
  textInput: {
    width: 250,
    height: 20,
    fontSize: 13,
    padding: 4,
  },
});

AppRegistry.registerComponent('SafeRoute', () => SafeRoute);
