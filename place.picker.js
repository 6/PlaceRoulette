'use strict';
import Qs from 'qs';
import Secrets from './secrets';

class PlacePicker {
  constructor(options) {
    this.radius = options.radius || 1000; // meters
    this.type = options.type || "restaurant"; // other options: cafe, bar, night_club, bakery, store
    this.photoMaxWidth = options.photoMaxWidth || 400;
    this.photoMaxHeight = options.photoMaxHeight || 400;
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;
  }

  getRandomPlace() {
    this._getCurrentLocation(
      (position) => {
        this._getNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude,
          (places) => {
            let place = places[Math.floor(Math.random()*places.length)];
            place.photoUrl = this._getPlacePhotoUrl(place);
            this.onSuccess(place);
          },
          this.onError,
        )
      },
      this.onError,
    )
  }

  _getCurrentLocation(onSuccess, onError) {
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (error) => onError(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  _getNearbyPlaces(latitude, longitude, onSuccess, onError) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
      location: [latitude, longitude].join(","),
      radius: this.radius,
      opennow: "true",
      type: this.type,
      key: Secrets.GOOGLE_PLACES_API_KEY,
    });
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "OK" && responseJson.results.length > 0) {
          onSuccess(responseJson.results);
        }
        else if (responseJson.status === "ZERO_RESULTS") {
          onError("No places found that are currently open.")
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

  _getPlacePhotoUrl(place) {
    let url = null;
    if (place.photos && place.photos.length > 0) {
      url = "https://maps.googleapis.com/maps/api/place/photo?" + Qs.stringify({
        photoreference: place.photos[0].photo_reference,
        maxwidth: this.photoMaxWidth,
        maxheight: this.photoMaxHeight,
        key: Secrets.GOOGLE_PLACES_API_KEY,
      });
    }
    return url;
  }
}

module.exports = PlacePicker;
