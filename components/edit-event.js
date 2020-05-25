/**
 * Affiche le formulaire pour modifier un événement
 */
import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, Switch } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input'
import Ionicons from "react-native-vector-icons/Ionicons"
import moment from "moment";

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:this.props.event.name,
      desc:this.props.event.desc,
      date:moment(this.props.event.date.seconds*1000),
      startTime:moment(this.props.event.startTime.seconds*1000),
      endTime:moment(this.props.event.endTime.seconds*1000),
      minUser:parseInt(this.props.event.minUser),
      maxUser:parseInt(this.props.event.maxUser),
      allDay:this.props.event.allDay,

      allEvents:false,

      showDate:false,
      showStartTime:false,
      showEndTime:false,

      errorEndTime:false,
      errorNbUser:false,
      errorName:false,
    };
  }
  showDatePicker=_=>{
    this.setState({showDate:true})
  }
  showStartTime=_=>{
    this.setState({showStartTime:true})
  }
  showEndTime=_=>{
    this.setState({showEndTime:true})
  }
  setDate=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showDate:false})
    }else{
      this.setState({date:moment(selectedDate),showDate:false})
    }
    this.checkData()
  }
  setStartTime=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showStartTime:false})
    }else{
      let time = selectedDate
      time.setTime(selectedDate.getTime());
      this.setState({startTime:moment(time),showStartTime:false})
    }
    this.checkData()
  }
  setEndTime=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showEndTime:false})
    }else{
      let time = selectedDate
      time.setTime(selectedDate.getTime());
      this.setState({endTime:moment(time),showEndTime:false})
    }
    this.checkData()
  }
  setName=(value)=>{
    this.setState({
      name:value,
      errorName:value.length<1
    })
    this.checkData()
  }
  setMinUser=(value)=>{
    this.setState({minUser:parseInt(value)})
    this.checkData()
  }
  setMaxUser=(value)=>{
    this.setState({maxUser:value})
    this.checkData()
  }
  checkData=_=>{
    let errEndTime=this.state.endTime.isBefore(this.state.startTime)
    let errNbUser=this.state.maxUser<this.state.minUser
    let errName = this.state.name.length<1
    this.setState({
      errorEndTime:errEndTime,
      errorNbUser:errNbUser,
      errorName:errName,
    })
    if(!errEndTime && !errNbUser && !errName){
      return true
    }
    return false
  }
  handleSubmit=_=>{
    if(this.checkData()){
      this.props.save(this.state)
    }
  }
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}> Modifier </Text>
        <Item floatingLabel style={[styles.itemContainer, this.state.errorName&&styles.error]}>
            <Label>Nom*</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setName(text)}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
              value={this.state.name}
            />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Description</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({desc: text})}
              autoCapitalize="sentences"
              multiline={true}
              autoCorrect={false}
              returnKeyType="next"
              value={this.state.desc}
            />
        </Item>
        {this.props.multiple&&(
          <View style={[styles.itemContainer, styles.iconAndText]}>
            <Label>Modifier tous les événements</Label>
            <Switch
              onValueChange={()=>this.setState({allEvents:!this.state.allEvents})}
              value={this.state.allEvents}
              style={styles.switch}
            />
          </View>
        )}
        {!this.state.allEvents&&(
          <View>
            <TouchableOpacity onPress={this.showDatePicker}>
            <View style={[styles.itemContainer, styles.iconAndText]}>
              <Ionicons name={"md-calendar"} size={30} style={styles.icon}/>
              <Text>{this.state.date.format("D - MM - YYYY")}</Text>
            </View>
          </TouchableOpacity>
          {this.state.showDate && (
            <DateTimePicker
              name="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              minimumDate={Date.now()}
              value={new Date(this.state.date)}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={this.setDate}
            />
          )}
          </View>
        )}
        <View style={[styles.itemContainer, styles.iconAndText]}>
          <Label>Toute la journée</Label>
          <Switch
            onValueChange={()=>this.setState({allDay:!this.state.allDay})}
            value={this.state.allDay}
            style={styles.switch}
          />
        </View>
        {!this.state.allDay && (
          <View>
            <TouchableOpacity onPress={this.showStartTime}>
              <View style={[styles.itemContainer, styles.iconAndText]}>
                <Ionicons name={"md-time"} size={30} color={"#444444"}/>
                <Text>{this.state.startTime.format("HH:mm")}</Text>
              </View>
            </TouchableOpacity>
            {this.state.showStartTime && (
              <DateTimePicker
                value={new Date(this.state.startTime)}
                mode={'time'}
                display="default"
                onChange={this.setStartTime}
              />
            )}
            <TouchableOpacity onPress={this.showEndTime}>
              <View style={[styles.itemContainer, styles.iconAndText, this.state.errorEndTime&&styles.error]}>
                <Ionicons name={"md-time"} size={30} color={"#444444"}/>
                <Text>{this.state.endTime.format("HH:mm")}</Text>
              </View>
            </TouchableOpacity>
            {this.state.showEndTime && (
              <DateTimePicker
                value={new Date(this.state.endTime)}
                minimumDate={new Date(this.state.startTime)}
                mode={'time'}
                display="default"
                onChange={this.setEndTime}
              />
            )}
          </View>
        )}
        <View style={[styles.nupdContainer, this.state.errorNbUser&&styles.error]}>
          <Text style={styles.nupdLabel}>Participants minimum :</Text>
          <NumericInput 
            onChange={(text)=> this.setMinUser(text)}
            value={this.state.minUser}
            minValue={0}
            valueType={'integer'}
            rounded={true}
            rightButtonBackgroundColor={'#249E6B'}
            leftButtonBackgroundColor={'#249E6B'}
            totalHeight={35}
          />
        </View>
        <View style={[styles.nupdContainer, this.state.errorNbUser&&styles.error]}>
          <Text style={styles.nupdLabel}>Participants maximum :</Text>
          <NumericInput 
            onChange={(text)=> this.setMaxUser(text)}
            value={this.state.maxUser}
            minValue={0}
            valueType={'integer'}
            rounded={true}
            rightButtonBackgroundColor={'#249E6B'}
            leftButtonBackgroundColor={'#249E6B'}
            totalHeight={35}
          />
        </View>
        <TouchableOpacity onPress={this.handleSubmit}>
          <View style={styles.button}>
            <Text style={styles.whiteText}>Sauvegarder</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    itemContainer: {
      marginTop: hp('1%'),
      marginLeft: wp('9%'),
      marginRight: wp('9%'),
    },
    title:{
      marginTop:hp('4%'),
      fontSize: 32,
      textAlign:'center'
    },
    button: {
      backgroundColor: '#249E6B',
      alignItems: 'center',
      padding: 10,
      marginTop: hp('4%'),
      marginLeft: wp('9%'),
      marginRight: wp('9%'),
      marginBottom: hp('3%')
    },
    whiteText:{
      color:'#ffffff'
    },
    iconAndText:{
      flexDirection:'row',
      alignItems: 'center',
    },
    icon:{
      marginRight:wp('1%'),
    },
    switch:{
      alignSelf:'flex-end'
    },
    error:{
      borderBottomWidth:2,
      borderColor:'#ff0000',
    },
    nupdContainer:{
      flexDirection:'row',
      marginTop: hp('1%'),
      marginLeft: wp('9%'),
      marginRight: wp('9%'),
    },
    nupdLabel:{
      flex:1,
      fontSize:18
    }
  });
export default EditEvent;
