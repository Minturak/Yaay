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
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{event.name}</Text>
        <Text>{event.desc}</Text>
        <View style={styles.date}>
          <Text>Le {moment(new Date(event.date.seconds*1000)).format("D.MM.YYYY ")}</Text>
          {event.allDay ?(
              <Text>toute la journée</Text>
            ):(
              <Text>de {moment(new Date(event.startTime.seconds*1000)).format("HH:mm")} à
                {moment(new Date(event.endTime.seconds*1000)).format(" HH:mm")}</Text>
            )
          }
        </View>
        <Text>Entre {event.minUser} et {event.maxUser} participants</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop:hp('2%'),
    marginLeft:wp('3%'),
    marginRight:wp('3%'),
    padding:hp('2%'),
  },
  title:{
    fontSize:18
  },
  date:{
    flexDirection:'row',
  }
});
const mapStateToProps = state => ({
  event: state.event,
});
export default connect(mapStateToProps)(EventDetailsScreen);
