/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AlertIOS,
  AppRegistry,
  Component,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from 'react-native-button';
var { RNLocation: Location } = require('NativeModules');

class PlaceRoulette extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Place Roulette
        </Text>
        <Text style={styles.instructions}>
          Choose a random place within 0.5 miles:
        </Text>
        <Button containerStyle={styles.rouletteButton} style={styles.rouletteButtonText} onPress={this._handleRoulettePress}>
          Spin!
        </Button>
      </View>
    );
  }

  _handleRoulettePress(event) {
    console.log('Pressed!');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        AlertIOS.alert(
         'Thanks!',
         "Your current position is: " + JSON.stringify(position),
        );
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 30,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    marginBottom: 40,
  },
  rouletteButton: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  rouletteButtonText: {
    fontSize: 36,
    color: 'green',
  }
});

AppRegistry.registerComponent('PlaceRoulette', () => PlaceRoulette);
