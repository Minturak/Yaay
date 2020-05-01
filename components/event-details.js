import React, { Component } from 'react';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
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
  toEdit=_=>{
    this.props.toEdit();
  }
  delete=_=>{
    this.props.delete()
  }
  render(){
    let event = this.props.event;
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleAndIcon}>
            <Text style={styles.title}>{event.name}</Text>
            {this.props.canUpdate && 
              <View style={styles.icons}>
                <MaterialIcons name={"edit"} size={20} onPress={this.toEdit}/>
                <MaterialIcons name={"delete"} size={20} onPress={this.delete}/>
              </View>
            }
          </View>
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
            ):(
              <TouchableOpacity onPress={this.toggleButtons} style={styles.button}>
                <Text>Modifier ma présence</Text>
              </TouchableOpacity>
            )}
        </View>
        <View>
          <Text style={styles.subTitle}>Présents : </Text>{
            this.props.presents.map((user,key)=>{
              return(<Text key={key} style={styles.user}>{user.pseudo}</Text>)
            })
          }
          <Text style={styles.subTitle}>Absents : </Text>{
            this.props.absents.map((user,key)=>{
              return(<Text key={key} style={styles.user}>{user.pseudo}</Text>)
            })
          }
          <Text style={styles.subTitle}>Peut-être : </Text>{
            this.props.maybe.map((user,key)=>{
              return(<Text key={key} style={styles.user}>{user.pseudo}</Text>)
            })
          }
          <Text style={styles.subTitle}>Pas répondu : </Text>{
            this.props.noresponse.map((user,key)=>{
              return(<Text key={key} style={styles.user}>{user.pseudo}</Text>)
            })
          }
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
  titleAndIcon:{
    flexDirection:'row',
  },  
  icons:{
    alignSelf:'flex-end',
    flexDirection:'row',
  },
  header:{
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:16,
    padding:hp('2%'),
  },
  title:{
    fontSize:18,
    flex:1
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
  },
  subTitle:{
    fontWeight:'bold',
    marginTop:hp('1%')
  },
  user:{
    marginLeft:wp('2%')
  }
});
export default EventDetails;
