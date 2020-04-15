import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment";
import EventDetails from "../components/event-details"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class EventDetailsScreen extends Component{
  constructor(props){
    super(props)

  }
  render(){
    return(
      <EventDetails event={this.props.event}/>
    )
  }
}

const mapStateToProps = state => ({
  event: state.event,
});
export default connect(mapStateToProps)(EventDetailsScreen);
