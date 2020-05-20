import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  isPresent=_=>{
    this.props.isPresent(this.props.user.user.uid,this.props.data.id);
  }
  isAbsent=_=>{
    this.props.isAbsent(this.props.user.user.uid,this.props.data.id);
  }
  mayBePresent=_=>{
    this.props.mayBePresent(this.props.user.user.uid,this.props.data.id);
  }
  render(){
    let event = this.props.data
    if(moment(event.date.seconds*1000).isBefore(moment(new Date()),'day')){
      return null
    }
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.eventSelected(event)}>
          <Text style={styles.title}>{event.name}</Text>
          <Text>Le {moment(new Date(event.date.seconds*1000)).format("D.MM.YYYY")}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.isPresent} style={[styles.present, styles.buttons, event.presents.includes(this.props.user.user.uid)&&styles.selected]}>
            <Text>Présent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.mayBePresent} style={[styles.maybe, styles.buttons, event.maybe.includes(this.props.user.user.uid)&&styles.selected]}>
            <Text>Peut-être</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.isAbsent} style={[styles.absent, styles.buttons, event.absents.includes(this.props.user.user.uid)&&styles.selected]}>
            <Text>Absent</Text>
          </TouchableOpacity>
        </View>
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
    width:wp('90%'),
  },
  title:{
    fontSize:18
  },
  buttonsContainer:{
    flexDirection:'row',
  },
  buttons:{
    alignItems: 'center',
    padding: 10,
    marginTop: hp('2%'),
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    flex:1,
    borderWidth:1,
    borderColor:'#ffffff'
  },
  present:{
    backgroundColor: '#249E6B',
  },
  absent:{
    backgroundColor: '#ff4f4f',
  },
  maybe:{
    backgroundColor: '#bfbfbf',
  },
  selected:{
    borderWidth:1,
    borderColor:"#000000"
  }
});
const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectEvent
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(EventCard);
