import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import EventCard from "../components/event-card";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { setCategories } from '../redux/actions/setCategories';
import { setInvitations } from '../redux/actions/setInvitations';
import { setGroups } from '../redux/actions/setGroups'
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';
import {db} from '../firebase';

class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      invitations:[],
      events:[],
      dispos:[],
    }
  }
  componentDidMount(){
    if(this.props.categories===undefined){
      this.fetchCategories();
    }
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }else{
      let uid = this.props.user.user.uid;
      this.listenerInvites(uid);
      this.listenerEvents(uid);
      this.listenerGroups(uid)
      this.listenerDispos(uid)
    }
  }
  listenerGroups(uid){
    db.collection('groups').where("users","array-contains",uid).onSnapshot(doc=>{
      let groups=[];
      doc.forEach(group=>{
        groups.push({id:group.id,data:group.data()})
      })
      this.props.setGroups(groups);
    })
  }
  listenerDispos(uid){
    db.collection('dispos').where("members","array-contains",uid).onSnapshot(doc=>{
      let dispos = [];
      doc.forEach(dispo=>{
        dispos.push({id:dispo.id,...dispo.data()})
      })
      this.setState({dispos:dispos})
    })
  }
  listenerInvites(uid){
    db.collection('users').doc(uid).onSnapshot(doc=>{
      let invites = doc.data().invitations||[];
    this.setState({invitations:invites});
    this.props.setInvitations(invites);
    });
  }
  listenerEvents(uid){
    db.collection('events').where("users","array-contains",uid).onSnapshot(doc=>{
      let events = [];
      doc.forEach(event=>{
        events.push({id:event.id,...event.data()})
      })
      events.sort(this.orderByDate);
      this.setState({events:events})
    })
  }
  orderByDate=(a,b)=>{
    if ( a.date.seconds < b.date.seconds ){
      return -1;
    }
    if ( a.date.seconds > b.date.seconds ){
      return 1;
    }
    return 0;
  }
  fetchCategories(){
    let categories=[];
    dbo.getCategories().then(doc=>{
      doc.data().labels.map(label=>{
        categories.push(label);
      })
      this.props.setCategories(categories);
    })
  }
  isPresent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'presents');
  }
  isAbsent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'absents');
  }
  mayBePresent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'maybe');
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('CreateEvent')}>
          <View style={styles.button}>
            <Text>Créer un événement</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Disposition')}>
          <View style={styles.button}>
            <Text>Indiquer mes dispositions</Text>
          </View>
        </TouchableOpacity>
        {this.state.invitations.length>0 &&
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Invitations')}>
            <View style={styles.button}>
              <Text>Nouvels invitations !</Text>
            </View>
          </TouchableOpacity>
        }
        {this.state.dispos.length>0 &&
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Dispositions')}>
            <View style={styles.button}>
              <Text>Nouvels dispositions</Text>
            </View>
          </TouchableOpacity>
        }
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.events}
            renderItem={({item})=>
            <EventCard data={item}
              navigation={this.props.navigation}
              isPresent={this.isPresent}
              isAbsent={this.isAbsent}
              mayBePresent={this.mayBePresent}
            />}
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    alignItems:'center',
  },
  listContainer:{
    marginBottom:hp('27%'),
  },
  invitations:{
    alignItems:'center',
    marginRight:wp('3%'),
    marginLeft:wp('3%'),
    width:wp('50%'),
    backgroundColor:'#249E6B',
    borderRadius:16,
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: wp('2%'),
    marginTop: hp('2%'),
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
  },
  buttonsContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center'
  },
});
const mapStateToProps = state => ({
  user: state.user,
  categories: state.categories,
  groups: state.groups,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setCategories,
      setInvitations,
      setGroups
    },
    dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(Home);
