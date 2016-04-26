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
import Qs from 'qs';
import Secrets from './secrets';

class PlaceRoulette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchRadius: 1000, // meters
      placeType: "restaurant", // cafe, bar, night_club, bakery, store
    };
    this._handleRoulettePress = this._handleRoulettePress.bind(this);
    this._onLoadingLocationError = this._onLoadingLocationError.bind(this);
  }

  render() {
    if(this.state.loading) {
      return this._renderLoadingView();
    }
    else {
      return this._renderRouletteView();
    }
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  _renderRouletteView() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Place Roulette
        </Text>
        <Text style={styles.instructions}>
          Choose a random place within 1km:
        </Text>
        <Button containerStyle={styles.rouletteButton} style={styles.rouletteButtonText} onPress={this._handleRoulettePress}>
          Spin!
        </Button>
      </View>
    );
  }

  _handleRoulettePress(event) {
    this.setState({loading: true});
    this._getCurrentLocation(
      (position) => {
        this._findNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude,
          (places) => {
            console.log("RESPONSE", places);
            this.setState({loading: false});
          },
          this._onLoadingLocationError,
        );
      },
      this._onLoadingLocationError,
    )
  }

  _onLoadingLocationError(errorMessage) {
    this.setState({loading: false});
    alert(errorMessage);
  }

  _getCurrentLocation(onSuccess, onError) {
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (error) => onError(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  _findNearbyPlaces(latitude, longitude, onSuccess, onError) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
      location: [latitude, longitude].join(","),
      radius: this.state.searchRadius,
      opennow: "true",
      type: this.state.placeType,
      key: Secrets.GOOGLE_PLACES_API_KEY,
    });
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "OK" && responseJson.results.length > 0) {
          onSuccess(responseJson.results);
        }
        else if (responseJson.status === "OK") {
          onError("No places found that are nearby and currently open.")
        }
        else {
          console.log(responseJson);
          onError("Invalid request to Google Places API.");
        }
      })
      .catch((error) => {
        console.log(error);
        onError("Unable to reach Google Places API.");
      });
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
    color: '#555',
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
  },
  loadingText: {
    fontSize: 24,
    color: '#bbb',
  },
});

AppRegistry.registerComponent('PlaceRoulette', () => PlaceRoulette);
