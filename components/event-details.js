import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker, Button,
  Switch} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment";

class EventDetails extends Component{
  constructor(props){
    super(props)
    this.state={
      showButtons:false
    }
  }
  toggleButtons=_=>{
    this.setState({showButtons:!this.state.showButtons})
  }
  isPresent=_=>{
    this.props.isPresent(this.props.user.user.uid);
    this.toggleButtons();
  }
  isAbsent=_=>{
    this.props.isAbsent(this.props.user.user.uid);
    this.toggleButtons();
  }
  mayBePresent=_=>{
    this.props.mayBePresent(this.props.user.user.uid);
    this.toggleButtons();
  }
  render(){
    let event = this.props.event;
    return(
      <View style={styles.container}>
        <View style={styles.header}>
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
        <View>
          {this.state.showButtons ?
            (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={this.isPresent} style={[styles.present, styles.buttons]}>
                  <Text>Présent</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.mayBePresent} style={[styles.maybe, styles.buttons]}>
                  <Text>Peut-être</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.isAbsent} style={[styles.absent, styles.buttons]}>
                  <Text>Absent</Text>
                </TouchableOpacity>
              </View>
            ):(
              <TouchableOpacity onPress={this.toggleButtons} style={styles.button}>
                <Text>Modifier ma présence</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop:hp('2%'),
    marginLeft:wp('2%'),
    marginRight:wp('2%'),
    padding:hp('2%'),
  },
  header:{
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:16,
    padding:hp('2%'),
  },
  title:{
    fontSize:18
  },
  date:{
    flexDirection:'row',
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('2%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
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
    flex:1
  },
  present:{
    backgroundColor: '#249E6B',
  },
  absent:{
    backgroundColor: '#ff4f4f',
  },
  maybe:{
    backgroundColor: '#bfbfbf',
  }
});
export default EventDetails;
