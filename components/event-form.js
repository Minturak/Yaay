import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TouchableOpacity, Picker, Switch, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input'
import Ionicons from "react-native-vector-icons/Ionicons"
import moment from "moment";

class EventForm extends Component{
  constructor(props){
    super(props)
    this.state={
      name:'',
      desc:'',
      group:undefined,
      date:moment(),
      startTime:moment(),
      endTime:moment(),
      until:moment(),
      allDay:false,
      minUser:0,
      maxUser:0,
      frequency:0,
      allowComments:false,
      reccurent:false,
      dateArray:[],
      selectedDate:0,

      showDate:false,
      showStartTime:false,
      showEndTime:false,
      showRecurrentDate:false,

      errorEndTime:false,
      errorNbUser:false,
      errorName:false,
      errorUntil:false,
    }
  }
  componentDidMount=_=>{
    if(this.props.dispo!==undefined){
      this.setState({name:this.props.dispo.name,desc:this.props.dispo.desc})
      let dateArray = []
      this.props.dispo.dates.map(date=>{
        dateArray.push(moment(new Date(date.date)))
      })
      this.setState({dateArray:dateArray,group:this.props.dispo.group})
    }else{
      this.setState({group:this.props.groups[0].id})
    }
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
  setDate=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showDate:false})
    }else{
      this.setState({date:moment(selectedDate),showDate:false})
    }
    this.checkData()
  }
  setUntil=(event,selectedDate)=>{
    if(event.type==='dismissed'){
      this.setState({showRecurrentDate:false})
    }else{
      this.setState({until:moment(selectedDate),showRecurrentDate:false})
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
  setDateFromPicker=(value)=>{
    this.setState({
      selectedDate:value,
      presents:this.props.dispo.dates[value].available,
      date:moment(this.props.dispo.dates[value].date)
    })
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
    let errUntil = this.state.date.isAfter(this.state.until,'day') && this.state.reccurent
    this.setState({
      errorEndTime:errEndTime,
      errorNbUser:errNbUser,
      errorName:errName,
      errorUntil:errUntil,
    })
    if(!errEndTime && !errNbUser && !errName && !errUntil){
      return true
    }
    return false
  }
  handleSubmit=_=>{
    if(this.checkData()){
      this.props.handleSubmit(this.state)
    }
  }
  render(){
    let dispo = this.props.dispo
    if(this.props.groups===undefined || this.props.groups.length<1){
      return null
    }
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nouvel événement</Text>
        {dispo===undefined &&
          <Picker
            style={styles.picker}
            selectedValue={this.state.group}
            onValueChange={(itemValue)=>this.setState({group:itemValue})}
          >
            {this.props.groups.map(group=>{
              return(<Picker.Item key={group.id} label={group.data.name} value={group.id}/>)
            })}
          </Picker>
        }
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
        {dispo===undefined && 
          <View>
            <TouchableOpacity onPress={this.showDatePicker}>
            <View style={[styles.itemContainer, styles.iconAndText]}>
              <Ionicons name={"md-calendar"} size={30} color={"#444444"} style={styles.icon}/>
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
        }
        <View style={[styles.itemContainer, styles.iconAndText]}>
          <Label style={styles.switchLabel}>Toute la journée</Label>
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
                testID="dateTimePicker"
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
                testID="dateTimePicker"
                value={new Date(this.state.endTime)}
                minimumDate={new Date(this.state.startTime)}
                mode={'time'}
                display="default"
                onChange={this.setEndTime}
              />
            )}
          </View>
        )}
        {dispo===undefined && 
          <View>
            <View style={[styles.itemContainer, styles.iconAndText]}>
              <Label style={styles.switchLabel}>Répéter</Label>
              <Switch
                onValueChange={()=>this.setState({reccurent:!this.state.reccurent})}
                value={this.state.reccurent}
                style={styles.switch}
              />
            </View>
            {this.state.reccurent&&(
              <View>
                <View style={[styles.nupdContainer, styles.days]}>
                  <Text>Tous les </Text>
                  <NumericInput 
                    onChange={(text)=> this.setState({frequency:text})}
                    value={this.state.frequency}
                    minValue={0}
                    valueType={'integer'}
                    rounded={true}
                    rightButtonBackgroundColor={'#249E6B'}
                    leftButtonBackgroundColor={'#249E6B'}
                    totalHeight={35}
                  />
                  <Text> jours</Text>
                </View>
                <View style={[styles.itemContainer, styles.days, this.state.errorUntil&&styles.error]}>
                  <Text>Jusqu'au </Text>
                  <TouchableOpacity onPress={this.showRecurrentDate}>
                    <View style={[styles.itemContainer, styles.iconAndText]}>
                      <Ionicons name={"md-calendar"} size={30} color={"#444444"} style={styles.icon}/>
                      <Text>{this.state.until.format("D - MM - YYYY")}</Text>
                    </View>
                  </TouchableOpacity>
                  {this.state.showRecurrentDate && (
                    <DateTimePicker
                      name="dateTimePicker"
                      timeZoneOffsetInMinutes={0}
                      minimumDate={Date.now()}
                      value={new Date(this.state.until)}
                      mode={'calendar'}
                      is24Hour={true}
                      display="default"
                      onChange={this.setUntil}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        }
        {dispo!==undefined && 
          <View>
            <Picker
              style={styles.picker}
              selectedValue={this.state.selectedDate}
              onValueChange={(itemValue)=>this.setDateFromPicker(itemValue)}
            >
            {this.state.dateArray.map((date,id)=>{
              return(<Picker.Item key={id} label={date.format("DD-MM")} value={id}/>)
             })
            }
            </Picker>
          </View>
        }
        <View style={styles.nupdContainer}>
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
        <View style={[styles.itemContainer, styles.iconAndText]}>
          <Label style={styles.switchLabel}>Autoriser les commentaires</Label>
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
  switchLabel:{
    flex:1
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
    alignItems:'center'
  },
  nbDays:{
    width:wp('10%'),
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
export default EventForm;
