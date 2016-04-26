## first-time setup

Follow instructions here under "Requirements": https://facebook.github.io/react-native/docs/getting-started.html

```
git clone git@github.com:6/PlaceRoulette.git
cd PlaceRoulette
npm install
```

## boot it up

```
react-native run-ios
```

In Simulator, make sure that you enable a valid Location under Debug > Location.

Press `ctrl + cmd + z` to open debugger UI in Chrome.

## run on device

1. connect iphone via usb
1. open AppDelegate.m in Xcode
1. uncomment line that says `jsCodeLocation = [[NSBundle mainBundle] ...`
1. press the "play" button

## update icon

1. edit `icon/icon.sketch` and export to png of 1024px or greater
1. upload to http://icon.angrymarmot.org/ and click Generate
1. open Xcode > Images.xcassets > AppIcon
1. drag and drop the generated icons into AppIcon
