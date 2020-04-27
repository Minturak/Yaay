import React, { Component } from 'react';
import EventForm from '../components/event-form';

import { connect } from 'react-redux'

import {dbo} from '../api/dbo';

class CreateEvent extends Component{
  handleSubmit=(state)=>{
    dbo.createEvent(state);
    this.props.navigation.navigate('Home');
  }
  render(){
    return(
      <EventForm groups={this.props.groups} handleSubmit={this.handleSubmit}/>
    )
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user,
});
export default connect(mapStateToProps)(CreateEvent);
