import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TouchableOpacity, Picker, Switch, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
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
      until:moment(),
      allDay:false,
      minUser:0,
      maxUser:0,
      allowComments:false,
      reccurent:true,

      showDate:false,
      showStartTime:false,
      showEndTime:false,
      showRecurrentDate:false,

      errorEndTime:false,
    }
  }
  componentDidMount(){
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
  showRecurrentDate=_=>{
    this.setState({showRecurrentDate:true})
  }
  changeDate=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showDate:false})
    }else{
      this.setState({date:moment(selectedDate),showDate:false})
    }
  }
  setUntil=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showRecurrentDate:false})
    }else{
      this.setState({until:moment(selectedDate),showRecurrentDate:false})
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
      if(moment(selectedDate.getTime()).isBefore(this.state.startTime)){
        this.setState({errorEndTime:true})
      }else{this.setState({errorEndTime:false})}
      this.setState({endTime:moment(time),showEndTime:false})
    }
  }
  handleSubmit=_=>{
    if(!this.state.errorEndTime){
      this.props.handleSubmit(this.state)
    }
  }
  render(){
    return(
      <ScrollView contentContainerStyle={styles.container}>
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
          <View style={[styles.itemContainer, styles.iconAndText]}>
            <MaterialCommunityIcons name={"calendar-month"} size={30} style={styles.icon}/>
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
            onChange={this.changeDate}
          />
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
          <View style={[styles.iconAndText]}>
            <TouchableOpacity onPress={this.showStartTime}>
              <View style={[styles.itemContainer, styles.iconAndText]}>
                <MaterialCommunityIcons name={"clock-outline"} size={30} style={styles.icon}/>
                <Text>{this.state.startTime.format("HH:mm")}</Text>
              </View>
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
              <View style={[styles.itemContainer, styles.iconAndText, this.state.errorEndTime&&styles.error]}>
                <MaterialCommunityIcons name={"clock-outline"} size={30} style={styles.icon}/>
                <Text>{this.state.endTime.format("HH:mm")}</Text>
              </View>
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
        <View style={[styles.itemContainer, styles.iconAndText]}>
          <Label>Répéter</Label>
          <Switch
            onValueChange={()=>this.setState({reccurent:!this.state.reccurent})}
            value={this.state.reccurent}
            style={styles.switch}
          />
        </View>
        {this.state.reccurent&&(
          <View>
            <View style={[styles.itemContainer, styles.days]}>
              <Text>Tous les </Text>
              <Item style={styles.nbDays}>
                <Input
                  keyboardType={'numeric'}
                  onChangeText={(text)=> this.setState({maxUser:text})}
                  value={this.state.maxUser}
                />
              </Item>
              <Text> jours</Text>
            </View>
            <View style={[styles.itemContainer, styles.days]}>
              <Text>Jusqu'au </Text>
              <TouchableOpacity onPress={this.showRecurrentDate}>
                <View style={[styles.itemContainer, styles.iconAndText]}>
                  <MaterialCommunityIcons name={"calendar-month"} size={30} style={styles.icon}/>
                  <Text>{this.state.until.format("D - MM - YYYY")}</Text>
                </View>
              </TouchableOpacity>
              {this.state.showRecurrentDate && (
                <DateTimePicker
                  name="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  minimumDate={Date.now()}
                  value={new Date(this.state.until)}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={this.setUntil}
                />
              )}
            </View>
          </View>
        )}
        <Item floatingLabel style={styles.itemContainer}>
          <Label>Participants minimum</Label>
          <Input
            keyboardType={'numeric'}
            onChangeText={(text)=> this.setState({minUser:text})}
            value={this.state.minUser}
          />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
          <Label>Participants maximum</Label>
          <Input
            keyboardType={'numeric'}
            onChangeText={(text)=> this.setState({maxUser:text})}
            value={this.state.maxUser}
          />
        </Item>
        <View style={[styles.itemContainer, styles.iconAndText]}>
          <Label>Autoriser les commentaires</Label>
          <Switch
            onValueChange={()=>this.setState({allowComments:!this.state.allowComments})}
            value={this.state.allowComments}
            style={styles.switch}
          />
        </View>
        <TouchableOpacity onPress={this.handleSubmit}>
          <View style={styles.button}>
            <Text style={{color:'#ffffff'}}>Créer</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
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
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
    marginBottom: hp('3%')
  },
  picker:{
    marginTop: hp('3%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  title:{
    marginTop:hp('2%'),
    fontSize:32,
    textAlign:'center',
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
  days:{
    flexDirection:'row',
    alignItems:'flex-end',
    marginTop:hp('-1%')
  },
  nbDays:{
    width:wp('10%'),
  },
});
export default EventForm;
