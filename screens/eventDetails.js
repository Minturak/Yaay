/**
 * Gère la logique pour l'affichage des détails d'un événement
 */
import React, { Component } from 'react';
import EventDetails from "../components/event-details"
import { Alert } from "react-native";

import { connect } from 'react-redux'

import {dbo} from '../api/dbo';
import {db} from '../firebase';

class EventDetailsScreen extends Component{
  constructor(props){
    super(props)
    this.state={
      event:this.props.event,
      users:[],
      presents:[],
      maybe:[],
      absents:[],
      noresponse:[],
      canUpdate:false,
    }
  }
  componentDidMount=_=>{
    this.canUpdate();
    this.snapshotEvent(this.props.event.id);
  }
  getUsers=(presence)=>{
    let ids = this.state.event[presence];
    let users = [];
    if(ids!==undefined && ids.length>0){
      ids.map(id=>{
        dbo.getUserData(id).then(doc=>{
          users.push({...doc.data(),id:id})
          this.setState({[presence]:users})
        })
      })
    }else{
      this.setState({[presence]:[]})
    }
  }
  snapshotEvent=(id)=>{
    db.collection('events').doc(id).onSnapshot(doc=>{
      this.updateEvent(doc,id);
    })
  }
  updateEvent=(doc,id)=>{
    this.setState({event:{...doc.data(),id:id}})
    this.getUsers("users");
    this.getUsers("presents");
    this.getUsers("maybe");
    this.getUsers("absents");
    this.getUsers("noresponse");
  }
  isPresent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'presents');
  }
  isAbsent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'absents');
  }
  mayBePresent=(uid)=>{
    dbo.setUserDisponibilityForEvent(uid,this.props.event.id,'maybe');
  }
  canUpdate=_=>{
    dbo.userAsOrganizersPrivilege(this.props.event.group,this.props.user.user.uid).then(res=>{
      this.setState({canUpdate:res})
    })
  }
  toEdit=_=>{
    this.props.navigation.navigate('EditEventScreen');
  }
  delete=_=>{
    dbo.getLinkedEvents(this.props.event.link).then(events=>{
      if(events.size>1){
        Alert.alert(
          "Suppression",
          "Voulez-vous supprimer cet événement ou tous les événements similaires ?",
          [
            { text: "Annuler"},
            { text: "Tous", onPress: () => {
                this.props.navigation.pop()
                this.props.navigation.navigate('Home')
                dbo.deleteMutipleEvents(this.props.event.link);
              } 
            },
            { text: "Cet événement", onPress: () => {
                this.props.navigation.pop()
                this.props.navigation.navigate('Home');
                dbo.deleteOneEvent(this.props.event.id,this.props.user.user.uid)
              }
            }
          ],
          { cancelable: true }
        );
      }else{
        Alert.alert(
          "Suppression",
          "Êtes-vous sûr de vouloir supprimer cet événement ?",
          [
            { text: "Annuler"},
            { text: "Oui", onPress: () => {
                this.props.navigation.pop()
                this.props.navigation.navigate('Home')
                dbo.deleteOneEvent(this.props.event.id,this.props.user.user.uid);
              } 
            },
          ],
          { cancelable: true }
        );
      }
    })
  }
  render(){
    return(
      <EventDetails
        event={this.state.event}
        user={this.props.user}
        isPresent={this.isPresent}
        isAbsent={this.isAbsent}
        mayBePresent={this.mayBePresent}
        toEdit={this.toEdit}
        delete={this.delete}
        users={this.state.users}
        presents={this.state.presents}
        maybe={this.state.maybe}
        absents={this.state.absents}
        noresponse={this.state.noresponse}
        canUpdate={this.state.canUpdate}
      />
    )
  }
}

const mapStateToProps = state => ({
  event: state.event,
  user: state.user,
});

export default connect(mapStateToProps)(EventDetailsScreen);
