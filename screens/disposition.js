import React, { Component } from 'react';
import DispositionForm from '../components/disposition-form';
import { connect } from 'react-redux'
import {dbo} from "../api/dbo"

class Disposition extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  handleSave=(data)=>{
    dbo.addDispo(data.name,data.desc,data.group,data.dates,this.props.user.user.uid).then(_=>{
      this.props.navigation.navigate('Home');
    });
  }
  isOrganizer=(group,uid)=>{
    if(group.data.admins.includes(uid)||group.data.organizers.includes(uid)){
      return true
    }
    return false
  }
  render(){
    if(this.props.groups.length<1){
      return null
    }
    return(
      <DispositionForm
        groups={this.props.groups}
        handleSave={this.handleSave}
        user={this.props.user.user}
      />
    )
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user
});
export default connect(mapStateToProps)(Disposition);
