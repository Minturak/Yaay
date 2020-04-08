import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./screens/home"
import EventForm from "./screens/event-form"
import Login from "./screens/login"
import SignUp from "./screens/signUp"
import GroupFormScreen from "./screens/groupFormScreen"
import ListGroups from "./screens/listGroups"
import GroupDetails from "./screens/groupDetails"
import EditGroupScreen from "./screens/EditGroupScreen"
import Invitations from "./screens/invitations"

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
    <GroupsStack.Navigator initialRouteName="ListGroups">
      <GroupsStack.Screen name="GroupFormScreen" component={GroupFormScreen} options={{ title: 'Nouveau groupe' }}/>
      <GroupsStack.Screen name="ListGroups" component={ListGroups} options={{ title: 'Mes groupes' }}/>
      <GroupsStack.Screen name="GroupDetails" component={GroupDetails} options={{ title: 'Détails' }}/>
      <GroupsStack.Screen name="EditGroupScreen" component={EditGroupScreen} options={{ title: 'Modifier' }}/>
    </GroupsStack.Navigator>
  )
}

function homeScreens(){
  return(
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} options={{ title: 'Accueil' }}/>
      <HomeStack.Screen name="EventForm" component={EventForm} options={{ title: 'Nouvel événement' }}/>
      <HomeStack.Screen name="Invitations" component={Invitations} options={{ title: 'Invitations' }}/>
      <HomeStack.Screen name="Login" component={Login} options={{ title: 'Connexion' }}/>
      <HomeStack.Screen name="SignUp" component={SignUp} options={{ title: 'Créer un compte' }}/>
    </HomeStack.Navigator>
  )
}

export default function App(){
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tabs.Navigator tabBarOptions={{activeTintColor:'#249E6B'}}>
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
