import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment";

import { connect } from 'react-redux'
import { selectEvent } from '../redux/actions/selectEvent';
import { bindActionCreators } from 'redux';

class EventCard extends Component{
  constructor(props){
    super(props)
  }
  eventSelected(event){
    this.props.selectEvent(event);
    this.props.navigation.navigate('EventDetailsScreen');
  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.eventSelected(this.props.data)}>
          <Text style={styles.title}>{this.props.data.name}</Text>
          <Text>Le {moment(new Date(this.props.data.date.seconds*1000)).format("D.MM.YYYY")}</Text>
        </TouchableOpacity>
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
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:16,
    padding:hp('2%'),
  },
  title:{
    fontSize:18
  },
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectEvent
    },
    dispatch,
)
export default connect(null,mapDispatchToProps)(EventCard);
