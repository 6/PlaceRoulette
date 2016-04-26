## first-time setup

```
npm install
```

## boot it up

```
react-native run-ios
```

In Simulator, make sure that you enable Location under Debug > Location.

Press `ctrl + cmd + z` to open debugger UI in Chrome.

## run on device

1. connect iphone via usb
1. open AppDelegate.m in Xcode
1. uncomment line that says `jsCodeLocation = [[NSBundle mainBundle] ...`
1. press the "play" button
