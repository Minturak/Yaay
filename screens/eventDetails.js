import React, { Component } from 'react';
import EventDetails from "../components/event-details"

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
    ids.map(id=>{
      dbo.getUserData(id).then(doc=>{
        users.push({...doc.data(),id:id})
        this.setState({[presence]:users})
      })
    })
  }
  snapshotEvent=(id)=>{
    let eventListener = db.collection('events').doc(id).onSnapshot(doc=>{
      this.updateEvent(doc,id);
    })
  }
  updateEvent=(doc,id)=>{
    this.setState({event:{...doc.data(),id:id}})
    this.getUsers("users");
    this.getUsers("presents");
    this.getUsers("maybe");
    this.getUsers("absents");
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
  toEdit(){

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
        users={this.state.users}
        presents={this.state.presents}
        maybe={this.state.maybe}
        absents={this.state.absents}
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
