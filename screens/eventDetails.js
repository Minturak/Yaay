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
import {db} from '../firebase';

class EventDetailsScreen extends Component{
  constructor(props){
    super(props)
    this.state={
      event:this.props.event,
    }
  }
  componentDidMount=_=>{
    this.snapshotEvent(this.props.event.id);
  }
  snapshotEvent=(id)=>{
    let eventListener = db.collection('events').doc(id).onSnapshot(doc=>{
      this.updateEvent(doc,id);
    })
  }
  updateEvent=(doc,id)=>{
    console.log(id);
    console.log(doc.data());
    this.setState({event:{...doc.data(),id:id}})
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
        event={this.state.event}
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
