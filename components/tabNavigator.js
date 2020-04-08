import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "../screens/home"
import EventForm from "../screens/event-form"
import Login from "../screens/login"
import SignUp from "../screens/signUp"
import GroupFormScreen from "../screens/groupFormScreen"
import ListGroups from "../screens/listGroups"
import GroupDetails from "../screens/groupDetails"
import EditGroupScreen from "../screens/EditGroupScreen"
import Invitations from "../screens/invitations"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const GroupsStack = createStackNavigator();

class TabNavigator extends Component{
  constructor(props){
    super(props)
  }
  groupsScreens(){
    return(
      <GroupsStack.Navigator initialRouteName="ListGroups">
        <GroupsStack.Screen name="GroupFormScreen" component={GroupFormScreen} options={{ title: 'Nouveau groupe' }}/>
        <GroupsStack.Screen name="ListGroups" component={ListGroups} options={{ title: 'Mes groupes' }}/>
        <GroupsStack.Screen name="GroupDetails" component={GroupDetails} options={{ title: 'Détails' }}/>
        <GroupsStack.Screen name="EditGroupScreen" component={EditGroupScreen} options={{ title: 'Modifier' }}/>
      </GroupsStack.Navigator>
    )
  }
  homeScreens(){
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
  render(){
    return(
      <Tabs.Navigator tabBarOptions={{activeTintColor:'#249E6B'}}>
        <Tabs.Screen name="Home" component={this.homeScreens} />
        {this.props.user!==undefined &&
          <Tabs.Screen name="Groups" component={this.groupsScreens} />
        }
      </Tabs.Navigator>
    )
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(TabNavigator);
