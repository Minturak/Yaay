import React, { Component } from 'react';
import DispositionForm from '../components/disposition-form';
import { connect } from 'react-redux'
import {dbo} from "../api/dbo"

class Disposition extends Component{
  constructor(props){
    super(props)
    this.state={
      ready:false,
      groups:[]
    }
  }
  componentDidMount=_=>{
    this.setState({ready:false})
    this.selectGroups()
  }
  handleSave=(data)=>{
    dbo.addDispo(data.name,data.desc,data.group,data.dates,this.props.user.user.uid).then(_=>{
      this.props.navigation.navigate('Home');
    });
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
    if(!this.state.ready){
      return null
    }
    return(
      <DispositionForm
        groups={this.state.groups}
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
