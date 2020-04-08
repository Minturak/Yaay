import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from "./components/tabNavigator";

import { Provider } from 'react-redux';
import configureStore from './redux/configureStore'

// The code below hides the message of Yellow box (on Android)
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

//The code bellow allow to write to firestore
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const store = configureStore();

export default function App(){
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator/>
      </NavigationContainer>
    </Provider>
  );
}
