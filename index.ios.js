/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  ActivityIndicatorIOS,
  AlertIOS,
  AppRegistry,
  Component,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  Image,
  Linking,
  TouchableHighlight,
  View
} from 'react-native';
import Button from 'react-native-button';
import Qs from 'qs';
import PlacePicker from './place.picker';

class PlaceRoulette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchRadius: 1000,
      placeType: "restaurant",
    };
    this._handleRoulettePress = this._handleRoulettePress.bind(this);
    this._openPlaceInMaps = this._openPlaceInMaps.bind(this);
    this._onLoadingLocationError = this._onLoadingLocationError.bind(this);
  }

  render() {
    if(this.state.loading) {
      return this._renderLoadingView();
    }
    else if (this.state.place) {
      return this._renderPlaceView();
    }
    else {
      return this._renderRouletteView();
    }
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS animating={true} style={styles.loadingIndicator} size="large" />
      </View>
    );
  }

  _renderRouletteView() {
    return (
      <View style={styles.container}>
        <Text style={[styles.baseText, styles.header]}>
          Place Roulette
        </Text>
        <Text style={[styles.baseText, styles.instructions]}>
          Choose a random place within 1km:
        </Text>
        <Button containerStyle={styles.rouletteButton} style={styles.rouletteButtonText} onPress={this._handleRoulettePress}>
          Spin!
        </Button>
      </View>
    );
  }

  _renderPlaceView() {
    let photo = null;
    if (this.state.place.photoUrl) {
      photo = (
        <TouchableHighlight onPress={this._openPlaceInMaps}>
          <Image style={styles.photo} source={{uri: this.state.place.photoUrl}} />
        </TouchableHighlight>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={[styles.baseText, styles.header]} onPress={this._openPlaceInMaps}>
          {this.state.place.name}
        </Text>
        {photo}
        <Text style={[styles.baseText, styles.address]} onPress={this._openPlaceInMaps}>
          {this.state.place.vicinity}
        </Text>
        <Button containerStyle={styles.rouletteButton} style={styles.rouletteButtonText} onPress={this._handleRoulettePress}>
          Spin!
        </Button>
      </View>
    )
  }

  _handleRoulettePress(event) {
    this.setState({loading: true});
    let placePicker = new PlacePicker({
      type: this.state.placeType,
      radius: this.state.searchRadius,
      photoMaxWidth: 600,
      photoMaxHeight: 400,
      onSuccess: (place) => {
        this.setState({loading: false, place: place});
      },
      onError: this._onLoadingLocationError,
    });
    placePicker.getRandomPlace();
  }

  _openPlaceInMaps(event) {
    let url = "http://maps.apple.com/?daddr=" + this.state.place.vicinity;
    Linking.openURL(url);
  }

  _onLoadingLocationError(errorMessage) {
    this.setState({loading: false});
    alert(errorMessage);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0FFFF',
    padding: 30,
  },
  baseText: {
    fontFamily: 'Avenir-Light',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontFamily: 'Avenir-Heavy',
    color: '#2761be',
  },
  instructions: {
    textAlign: 'center',
    color: '#6495ED',
    fontSize: 18,
    marginBottom: 40,
  },
  rouletteButton: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: '#ffaf1a',
    borderRadius: 20,
  },
  rouletteButtonText: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'GillSans-UltraBold',
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 300,
    height: 200,
    margin: 10,
  },
  address: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: '#00bfff',
    fontSize: 18,
    marginBottom: 40,
  }
});

AppRegistry.registerComponent('PlaceRoulette', () => PlaceRoulette);
