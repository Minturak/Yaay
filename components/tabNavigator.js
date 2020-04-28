import React, { Component } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Home from "../screens/home"
import Login from "../screens/login"
import SignUp from "../screens/signUp"
import GroupFormScreen from "../screens/groupFormScreen"
import ListGroups from "../screens/listGroups"
import GroupDetailsScreen from "../screens/groupDetails"
import EditGroupScreen from "../screens/EditGroupScreen"
import Invitations from "../screens/invitations"
import CreateEvent from "../screens/createEvent"
import EventDetailsScreen from "../screens/eventDetails";
import Disposition from "../screens/disposition"
import DispositionsList from "../screens/dispositions";
import DispositionDetailsScreen from "../screens/dispositionDetails";
import EditEventScreen from "../screens/editEventScreen";
import Account from "../screens/account"



import { connect } from 'react-redux'

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const GroupsStack = createStackNavigator();
const AccountStack = createStackNavigator();

class TabNavigator extends Component{
  constructor(props){
    super(props)
  }
  accountScreens(){
    return(
      <AccountStack.Navigator initialRouteName="Account">
        <AccountStack.Screen name="Account" component={Account} options={{ title: 'Profil' }}/>
      </AccountStack.Navigator>
    )
  }
  groupsScreens(){
    return(
      <GroupsStack.Navigator initialRouteName="ListGroups">
        <GroupsStack.Screen name="GroupFormScreen" component={GroupFormScreen} options={{ title: 'Nouveau groupe' }}/>
        <GroupsStack.Screen name="ListGroups" component={ListGroups} options={{ title: 'Mes groupes' }}/>
        <GroupsStack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Détails' }}/>
        <GroupsStack.Screen name="EditGroupScreen" component={EditGroupScreen} options={{ title: 'Modifier' }}/>
      </GroupsStack.Navigator>
    )
  }
  homeScreens(){
    return(
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen name="Home" component={Home} options={{ title: 'Accueil' }}/>
        <HomeStack.Screen name="Invitations" component={Invitations} options={{ title: 'Invitations' }}/>
        <HomeStack.Screen name="Login" component={Login} options={{ title: 'Connexion' }}/>
        <HomeStack.Screen name="SignUp" component={SignUp} options={{ title: 'Créer un compte' }}/>
        <HomeStack.Screen name="CreateEvent" component={CreateEvent} options={{ title: 'Créer un événement' }}/>
        <HomeStack.Screen name="EventDetailsScreen" component={EventDetailsScreen} options={{ title: 'Détails' }}/>
        <HomeStack.Screen name="Disposition" component={Disposition} options={{ title: 'Indiquer ses dispositions' }}/>
        <HomeStack.Screen name="Dispositions" component={DispositionsList} options={{ title: 'Liste des dispositions' }}/>
        <HomeStack.Screen name="DispositionDetails" component={DispositionDetailsScreen} options={{ title: 'Détails' }}/>
        <HomeStack.Screen name="EditEventScreen" component={EditEventScreen} options={{ title: 'Modifier' }}/>
      </HomeStack.Navigator>
    )
  }
  render(){
    return(
      <Tabs.Navigator 
        tabBarOptions={{activeTintColor:'#249E6B',showIcon: true}}
        screenOptions={({route})=>({
          tabBarIcon:()=>{
            let iconName;
            if(route.name==="Accueil"){return <Ionicons name={"md-home"} size={30} color={"#444444"}/>}
            else if(route.name==="Groupes"){return <MaterialIcons name={"group"} size={30} />}
            else if(route.name==="Profil"){return <Ionicons name={"md-person"} size={30} color={"#444444"}/>}
          }}
        )}
      >
        <Tabs.Screen name="Accueil" component={this.homeScreens}/>
        {this.props.user!==undefined &&
          <>
            <Tabs.Screen name="Groupes" component={this.groupsScreens}/>
            <Tabs.Screen name="Profil" component={this.accountScreens}/>
          </>
        }
      </Tabs.Navigator>
    )
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(TabNavigator);
