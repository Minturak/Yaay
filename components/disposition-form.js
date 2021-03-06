/**
 * Affiche le formulaire pour créer une disposition
 */
import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import { CheckBox } from 'react-native-elements'
import { StyleSheet, Text, View, TouchableOpacity, Picker, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Alert } from "react-native";
import moment from "moment"
import 'moment/locale/fr'

class DispositionForm extends Component{
  constructor(props){
    super(props)
    this.state={
      group:undefined,
      name:'',
      desc:'',
      dates:[],
    }
  }
  componentDidMount=_=>{
    if(this.props.groups!==undefined){
      this.setDates();
      this.setState({group:this.props.groups[0].id})
    }
    moment.locale('fr')
  }
  setDates(){
    let today = new Date();
    let dates = [];
    for(let i = 0;i<=5;i++){
      dates[i] = {date:today.setDate(today.getDate()+1),selected:false,id:i,available:[]};
    }
    this.setState({dates:dates});
  }
  handleCheck=(evt)=>{
    let dates = this.state.dates;
    dates[evt.id]={date:evt.date,selected:!evt.selected,id:evt.id,available:[this.props.user.uid]};
    this.setState({dates:dates})
  }
  handleSave=_=>{
    if(this.state.name.length<1){
      Alert.alert(
        "Erreur",
        "Indiquez au minimum un nom",
        [
          {text: "Ok"}
        ],
        { cancelable: false }
      );
    }else{
      this.props.handleSave(this.state);
    }
    
  }
  render(){
    if(this.props.user===undefined){
      return null
    }
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nouvel disposition</Text>
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
        <View style={styles.checkBoxContainer}>
          {this.state.dates.map((date,i)=>{
            return(
              <CheckBox
                key={i-1}
                title={moment(date.date).format("dddd DD.MM")}
                checked={date.selected}
                containerStyle={styles.checkBox}
                onPress={()=>{this.handleCheck(date)}}
                iconType={'font-awesome'}
              />
            )
          })}
        </View>
        <TouchableOpacity onPress={this.handleSave}>
          <View style={styles.saveButton}>
            <Text style={styles.whiteText}>Créer</Text>
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
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  saveButton: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  whiteText:{
    color:'#ffffff'
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
  checkBoxContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: 'center',
  },
  checkBox:{
    width:wp('30%'),
  }
});
export default DispositionForm;
