import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Picker, Button,
  Switch} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

class EventForm extends Component{
  constructor(props){
    super(props)
    this.state={
      name:'',
      desc:'',
      group:this.props.groups[0].id,
      date:moment(),
      startTime:moment(),
      endTime:moment(),
      allDay:false,
      minUser:0,
      maxUser:0,
      allowComments:false,

      maxDate:undefined,
      showDate:false,
      showStartTime:false,
      showEndTime:false,
    }
  }
  componentDidMount(){
    let maxDate = new Date(Date.now())
    maxDate = maxDate.setDate(maxDate.getDate()+5);
    this.setState({maxDate:maxDate});
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
  changeDate=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showDate:false})
    }else{
      this.setState({date:moment(selectedDate),showDate:false})
    }
  }
  changeStartTime=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showStartTime:false})
    }else{
      let time = selectedDate
      selectedDate.setTime(selectedDate.getTime());
      this.setState({startTime:moment(time),showStartTime:false})
    }
  }
  changeEndTime=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showEndTime:false})
    }else{
      let time = selectedDate
      selectedDate.setTime(selectedDate.getTime());
      this.setState({endTime:moment(time),showEndTime:false})
    }
  }
  handleSubmit=()=>{
    this.props.handleSubmit(this.state)
  }
  render(){
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Text style={styles.title}>Nouvel événement</Text>
        <Picker
          style={styles.picker}
          selectedValue={this.state.group}
          onValueChange={(itemValue)=>this.setState({group:itemValue})}
        >
          {this.props.groups.map(group=>{
            return(<Picker.Item key={group.id} label={group.data.name} value={group.id}/>)
          })}
        </Picker>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Nom</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({name: text})}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
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
            />
        </Item>
        <TouchableOpacity onPress={this.showDatePicker}>
          <View><Text>{this.state.date.format("D - MM - YYYY")}</Text></View>
        </TouchableOpacity>
        {this.state.showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            minimumDate={Date.now()}
            maximumDate={this.state.maxDate}
            value={new Date(this.state.date)}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.changeDate}
          />
        )}
        <Label>Toute la journée</Label>
        <Switch
          onValueChange={()=>this.setState({allDay:!this.state.allDay})}
          value={this.state.allDay}
        />
        {!this.state.allDay && (
          <View>
            <TouchableOpacity onPress={this.showStartTime}>
              <View><Text>{this.state.startTime.format("HH:mm")}</Text></View>
            </TouchableOpacity>
              {this.state.showStartTime && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(this.state.startTime)}
                  mode={'time'}
                  display="default"
                  onChange={this.changeStartTime}
                />
              )}
              <TouchableOpacity onPress={this.showEndTime}>
                <View><Text>{this.state.endTime.format("HH:mm")}</Text></View>
              </TouchableOpacity>
              {this.state.showEndTime && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(this.state.endTime)}
                  minimumDate={new Date(this.state.startTime)}
                  mode={'time'}
                  display="default"
                  onChange={this.changeEndTime}
                />
              )}
          </View>
        )}
        <Item floatingLabel>
          <Label>Participants minimum</Label>
          <Input
            keyboardType={'numeric'}
            onChangeText={(text)=> this.setState({minUser:text})}
            value={this.state.minUser}
          />
        </Item>
        <Item floatingLabel>
          <Label>Participants maximum</Label>
          <Input
            keyboardType={'numeric'}
            onChangeText={(text)=> this.setState({maxUser:text})}
            value={this.state.maxUser}
          />
        </Item>
        <Label>Autoriser les commentaires</Label>
        <Switch
          onValueChange={()=>this.setState({allowComments:!this.state.allowComments})}
          value={this.state.allowComments}
        />
      <TouchableOpacity onPress={this.handleSubmit}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Créer</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  itemContainer: {
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  signUpButton: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  picker:{
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  title:{
    marginTop:hp('4%'),
    fontSize: 32,
    textAlign:'center'
  },
});
export default EventForm;
