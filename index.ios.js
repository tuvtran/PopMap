/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  Alert,
  AppRegistry,
  Component,
  Image,
  MapView,
  PropTypes,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

class RouteInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '',
      destination: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            onChangeText={(text) => this.setState({origin: text})}
            onSubmitEditing={(text) => this.refs.DestinationInput.focus()}
            placeholder={'Origin'}
            returnKeyType={'next'}
            style={styles.textInput}
            value={this.state.origin} />
        </View>
        <View style={styles.row}>
          <TextInput
            ref='DestinationInput'
            onChangeText={(text) => this.setState({destination: text})}
            onSubmitEditing={(_) => this.requestRoute()}
            placeholder={'Destination'}
            returnKeyType='route'
            style={styles.textInput}
            value={this.state.destination} />
        </View>
      </View>
    );
  }

  requestRoute() {
    console.log('origin: ' + this.state.origin);
    console.log('destination: ' + this.state.destination);
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    paddingTop: 100,
  },
  textInput: {
    width: 250,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
    marginLeft: 10,
  },
});

AppRegistry.registerComponent('SafeRoute', () => SafeRoute);
