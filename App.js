import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./screens/home"
import EventForm from "./screens/event-form"
import Login from "./screens/login"
import SignUp from "./screens/signUp"
import GroupScreen from "./screens/groupScreen"
import ViewGroups from "./screens/viewGroups"

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
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const GroupsStack = createStackNavigator();

function groupsScreens(){
  return(
    <GroupsStack.Navigator initialRouteName="ViewGroups">
      <GroupsStack.Screen name="GroupForm" component={GroupScreen}/>
      <GroupsStack.Screen name="ViewGroups" component={ViewGroups}/>
    </GroupsStack.Navigator>
  )
}

function homeScreens(){
  return(
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="EventForm" component={EventForm} />
      <HomeStack.Screen name="Login" component={Login} />
      <HomeStack.Screen name="SignUp" component={SignUp} />
    </HomeStack.Navigator>
  )
}

export default function App(){
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tabs.Navigator>
          <Tabs.Screen name="Home" component={homeScreens} />
          <Tabs.Screen name="Groups" component={groupsScreens} />
        </Tabs.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
