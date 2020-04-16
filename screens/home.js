import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, FlatList } from 'react-native';
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

import {dbo} from '../dataObjects/dbo';
import {db} from '../firebase';

class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      invitations:[],
      events:[],
    }
  }
  componentDidMount(){
    if(this.props.categories===undefined){
      this.fetchCategories();
    }
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }else{
      this.snapshot();
    }
  }
  snapshot(){
    const doc = db.collection('users').doc(this.props.user.user.uid);
    const observer = doc.onSnapshot(doc=>{
      this.updateInvites(doc);
      this.updateGroups(doc);
    })
  }
  groupSnapshot=(id)=>{
    const group = db.collection('groups').doc(id);
    const groupObserv = group.onSnapshot(doc=>{
      this.updateEvents(doc);
    })
  }
  eventSnapshot=(id)=>{
    const event = db.collection('events').doc(id);
    const eventObserver = event.onSnapshot(doc=>{
      this.updateEvent(doc,id);
    })
  }
  updateEvent=(doc,id)=>{
    let events = this.state.events;
    let index = events.indexOf(el=>el.id===id)
    events.splice(index,1);
    events.push({...doc.data(),id:id})
    this.setState({events:events})
  }
  updateEvents=(doc)=>{
    let update = doc.data().events;
    let events = this.state.events;
    update.map(id=>{
      dbo.getEventData(id).then(event=>{
        this.eventSnapshot(id);
        let objEvent = {...event.data(),id:id}
        if(events.filter(el=>(el.id===id)).length>=1){
          let index = events.indexOf(events.filter(el=>(el.id===id)))
          events.splice(index,1)
          events.push(objEvent)
        }else{
          events.push(objEvent)
        }
        this.setState({events:events})
      })
    })
  }
  updateInvites=(doc)=>{
    let invites = doc.data().invitations||[];
    this.setState({invitations:invites});
    this.props.setInvitations(invites);
  }
  updateGroups=(doc)=>{
    let groupsIds = doc.data().groups||[];
    let groups=[];
    if(groupsIds.length>0){
      groupsIds.map(id=>{
        this.groupSnapshot(id);
        dbo.getGroupData(id).then(data=>{
          groups.push({data:data.data(),id:id})
          this.props.setGroups(groups);
        })
      })
    }
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
        <TouchableHighlight onPress={()=>this.props.navigation.navigate('CreateEvent')}>
          <View style={styles.button}>
            <Text>Créer un événement</Text>
          </View>
        </TouchableHighlight>
        <Text>Bienvenue sur Yaay !</Text>
        {this.state.invitations.length>0 &&
          <TouchableHighlight onPress={()=>this.props.navigation.navigate('Invitations')}>
            <View style={styles.invitations}>
              <Text>Nouvels invitations !</Text>
            </View>
          </TouchableHighlight>
        }
        <FlatList
          data={this.state.events}
          renderItem={({item})=><EventCard data={item}
            navigation={this.props.navigation}
            isPresent={this.isPresent}
            isAbsent={this.isAbsent}
            mayBePresent={this.mayBePresent}
          />}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    alignItems:'center',
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
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
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
