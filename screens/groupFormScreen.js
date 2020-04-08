import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroupForm from "../components/group-form"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from "firebase";
import {dbo} from '../dataObjects/dbo';

class GroupFormScreen extends Component{
  handleSubmit=(name,desc,cat)=>{
    var idUser = firebase.auth().currentUser.uid;
    //création du groupe
    dbo.createGroup(name,desc,cat,idUser)
      .then(docRef=>{
      //ajout du groupe dans l'utilisateur
      dbo.getUserData(idUser).then(doc => {
        dbo.addGroupToUser(idUser,doc,docRef.id);
      })
    });
    this.props.navigation.navigate('ViewGroups');
  }
  render(){
    return(
      <GroupForm handleSubmit={this.handleSubmit} categories={this.props.categories}/>
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories,
  group: state.group,
});
export default connect(mapStateToProps)(GroupFormScreen);
