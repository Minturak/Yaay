/**
 * Gère la logique pour la création d'un événement
 */
import React, { Component } from 'react';
import EventForm from '../components/event-form';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { eventFrom } from '../redux/actions/eventFrom';

import {dbo} from '../api/dbo';

class CreateEvent extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[],
      ready:false
    }
  }
  componentDidMount=_=>{
    this.setState({ready:false})
    this.selectGroups()
  }
  componentWillUnmount=_=>{
    this.props.eventFrom(undefined)
  }
  handleSubmit=(state)=>{
    dbo.createEvent(state)
    this.props.navigation.navigate('Home');
  }
  selectGroups=_=>{
    this.props.groups.map(group=>{
      if(this.isOrganizer(group,this.props.user.user.uid)){
        let groups = this.state.groups
        groups.push(group)
        this.setState({groups:groups})
      }
    })
    this.setState({ready:true})
    if(this.state.groups.length<1){
      this.props.navigation.navigate('Home')
    }
  }
  isOrganizer=(group,uid)=>{
    if(group.data.admins.includes(uid)||group.data.organizers.includes(uid)){
      return true
    }
    return false
  }
  render(){
    if(this.state.ready){
      return(
        <EventForm 
          groups={this.state.groups} 
          dispo={this.props.eventFromDispo}
          handleSubmit={this.handleSubmit}
        />
      )
    }else{return null}
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user,
  eventFromDispo:state.eventFrom,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    eventFrom,
  },
  dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(CreateEvent);
