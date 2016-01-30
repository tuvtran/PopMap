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
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

class AwesomeProject extends Component {
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
          <Text>
            {'Origin'}
          </Text>
          <TextInput
            onChangeText={(text) => this.setState({origin: text})}
            onSubmitEditing={(text) => this.refs.DestinationInput.focus()}
            returnKeyType={'next'}
            style={styles.textInput}
            value={this.state.origin}/>
          <TextInput />
        </View>
        <View style={styles.row}>
          <Text>
            {'Destination'}
          </Text>
          <TextInput
            ref='DestinationInput'
            onChangeText={(text) => this.setState({destination: text})}
            onSubmitEditing={(_) => this.requestRoute()}
            returnKeyType='go'
            style={styles.textInput}
            value={this.state.destination}/>
          <TextInput />
        </View>
      </View>
    );
  }

  requestRoute() {
    console.log('origin: ' + this.state.origin);
    console.log('destination: ' + this.state.destination);
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: 150,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
  },
});

AppRegistry.registerComponent('SafeRoute', () => AwesomeProject);
