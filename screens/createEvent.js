import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventForm from '../components/event-form';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from "firebase";
import {dbo} from '../dataObjects/dbo';

class CreateEvent extends Component{
  handleSubmit=(state)=>{
    console.log(state);
    dbo.createEvent(state).then(docRef=>{
      dbo.addEventToGroup(docRef,state.group);
    })
    //this.props.navigation.navigate('Home');
  }
  render(){
    return(
      <EventForm groups={this.props.groups} handleSubmit={this.handleSubmit}/>
    )
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user,
});
export default connect(mapStateToProps)(CreateEvent);
