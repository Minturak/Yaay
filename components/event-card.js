import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment";

class EventCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.groupSelected(this.props.groupData)}>
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
export default EventCard;
