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

//class AwesomeProject extends Component {
  //constructor(props) {
    //super(props);
    //this.state = {
      //origin: '',
      //destination: '',
    //};
  //}

  //render() {
    //return (
      //<View style={styles.container}>
        //<View style={styles.row}>
          //<Text>
            //{'Origin'}
          //</Text>
          //<TextInput
            //onChangeText={(text) => this.setState({origin: text})}
            //onSubmitEditing={(text) => this.refs.DestinationInput.focus()}
            //returnKeyType={'next'}
            //style={styles.textInput}
            //value={this.state.origin}/>
          //<TextInput />
        //</View>
        //<View style={styles.row}>
          //<Text>
            //{'Destination'}
          //</Text>
          //<TextInput
            //ref='DestinationInput'
            //onChangeText={(text) => this.setState({destination: text})}
            //onSubmitEditing={(_) => this.requestRoute()}
            //returnKeyType='go'
            //style={styles.textInput}
            //value={this.state.destination}/>
          //<TextInput />
        //</View>
        //<View style={styles.row}>
          //<MapView
            //initialRegion={{
              //latitude: 38.78825,
              //longitude: -122.4324,
              //latitudeDelta: 0.0922,
              //longitudeDelta: 0.0421,
            //}}
          ///>
        //</View>
      //</View>
    //);
  //}

  //requestRoute() {
    //console.log('origin: ' + this.state.origin);
    //console.log('destination: ' + this.state.destination);
  //}
//}

var regionText = {
  latitude: '0',
  longitude: '0',
  latitudeDelta: '0',
  longitudeDelta: '0',
};

var MapRegionInput = React.createClass({

  propTypes: {
    region: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      region: {
        latitude: 0,
        longitude: 0,
      }
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      region: nextProps.region || this.getInitialState().region
    });
  },

  render: function() {
    var region = this.state.region || this.getInitialState().region;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>
            {'Latitude'}
          </Text>
          <TextInput
            value={'' + region.latitude}
            style={styles.textInput}
            onChange={this._onChangeLatitude}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Longitude'}
          </Text>
          <TextInput
            value={'' + region.longitude}
            style={styles.textInput}
            onChange={this._onChangeLongitude}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Latitude delta'}
          </Text>
          <TextInput
            value={
              region.latitudeDelta == null ? '' : String(region.latitudeDelta)
            }
            style={styles.textInput}
            onChange={this._onChangeLatitudeDelta}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Longitude delta'}
          </Text>
          <TextInput
            value={
              region.longitudeDelta == null ? '' : String(region.longitudeDelta)
            }
            style={styles.textInput}
            onChange={this._onChangeLongitudeDelta}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.changeButton}>
          <Text onPress={this._change}>
            {'Change'}
          </Text>
        </View>
      </View>
    );
  },

  _onChangeLatitude: function(e) {
    regionText.latitude = e.nativeEvent.text;
  },

  _onChangeLongitude: function(e) {
    regionText.longitude = e.nativeEvent.text;
  },

  _onChangeLatitudeDelta: function(e) {
    regionText.latitudeDelta = e.nativeEvent.text;
  },

  _onChangeLongitudeDelta: function(e) {
    regionText.longitudeDelta = e.nativeEvent.text;
  },

  _change: function() {
    this.setState({
      region: {
        latitude: parseFloat(regionText.latitude),
        longitude: parseFloat(regionText.longitude),
        latitudeDelta: parseFloat(regionText.latitudeDelta),
        longitudeDelta: parseFloat(regionText.longitudeDelta),
      },
    });
    this.props.onChange(this.state.region);
  },

});

var MapViewExample = React.createClass({

  getInitialState() {
    return {
      isFirstLoad: true,
      mapRegion: undefined,
      mapRegionInput: undefined,
      annotations: [],
    };
  },

  render() {
    return (
      <View>
        <MapRegionInput
          onChange={this._onRegionInputChanged}
          region={this.state.mapRegionInput}
        />
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

  _getAnnotations(region) {
    return [{
      longitude: region.longitude,
      latitude: region.latitude,
      title: 'You Are Here',
    }];
  },

  _onRegionChange(region) {
    this.setState({
      mapRegionInput: region,
    });
  },

  _onRegionChangeComplete(region) {
    if (this.state.isFirstLoad) {
      this.setState({
        mapRegionInput: region,
        annotations: this._getAnnotations(region),
        isFirstLoad: false,
      });
    }
  },

  _onRegionInputChanged(region) {
    this.setState({
      mapRegion: region,
      mapRegionInput: region,
      annotations: this._getAnnotations(region),
    });
  },

});

var styles = StyleSheet.create({
  map: {
    height: 150,
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
    width: 150,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
  },
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
});

AppRegistry.registerComponent('SafeRoute', () => MapViewExample);
