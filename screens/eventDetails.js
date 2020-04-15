import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import EventDetails from "../components/event-details"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {dbo} from '../dataObjects/dbo';

class EventDetailsScreen extends Component{
  constructor(props){
    super(props)
  }
  isPresent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'presents');
  }
  isAbsent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'absents');
  }
  mayBePresent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'maybe');
  }
  render(){
    return(
      <EventDetails
        event={this.props.event}
        user={this.props.user}
        isPresent={this.isPresent}
        isAbsent={this.isAbsent}
        mayBePresent={this.mayBePresent}
      />
    )
  }
}

const mapStateToProps = state => ({
  event: state.event,
  user: state.user,
});
export default connect(mapStateToProps)(EventDetailsScreen);
