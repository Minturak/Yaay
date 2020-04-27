import React, { Component } from 'react';
import EventForm from '../components/event-form';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { eventFrom } from '../redux/actions/eventFrom';

import {dbo} from '../api/dbo';

class CreateEvent extends Component{
  componentWillUnmount=_=>{
    this.props.eventFrom(undefined)
  }
  handleSubmit=(state)=>{
    dbo.createEvent(state)
    this.props.navigation.navigate('Home');
  }
  render(){
    console.log(this.props.eventFromDispo);
    
    return(
      <EventForm 
        groups={this.props.groups} 
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
