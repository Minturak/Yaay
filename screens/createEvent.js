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
    let groups = []
    this.props.groups.map(group=>{
      dbo.userAsOrganizersPrivilege(group.id,this.props.user.user.uid).then(res=>{
        if(res){
          groups.push(group)
          this.setState({groups:groups,ready:true})
        }
      })
      this.setState({groups:groups,ready:true})
    })
    if(this.state.groups.length<1){
      this.props.navigation.pop()
    }
  }
  render(){
    if(!this.state.ready){
      return null
    }
    console.log(this.state);
    return(
      <EventForm 
        groups={this.state.groups} 
        dispo={this.props.eventFromDispo}
        handleSubmit={this.handleSubmit}
      />
    )
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
