import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class EventDetailsScreen extends Component{
  constructor(props){
    super(props)

  }
  render(){
    let event = this.props.event;
    console.log(this.props.event);
    return(
      <View>
        <Text>{event.name}</Text>
        <Text>{event.desc}</Text>
        <Text>{moment(new Date(event.date.seconds*1000)).format("D.MM.YYYY")}</Text>
        {event.allDay ?(
            <Text>Toute la journée</Text>
          ):(
            <Text>De {moment(new Date(event.startTime.seconds*1000)).format("HH:mm")} à
              {moment(new Date(event.endTime.seconds*1000)).format(" HH:mm")}</Text>
          )
        }
        <Text>Entre {event.minUser} et {event.maxUser} participants</Text>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  event: state.event,
});
export default connect(mapStateToProps)(EventDetailsScreen);
