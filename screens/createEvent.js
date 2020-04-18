import React, { Component } from 'react';
import EventForm from '../components/event-form';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from "firebase";
import {dbo} from '../api/dbo';

class CreateEvent extends Component{
  handleSubmit=(state)=>{
    dbo.createEvent(state);
    this.props.navigation.navigate('Home');
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
