import React, { Component } from 'react';
import { connect } from 'react-redux'
import DispositionDetails from "../components/disposition-details"
import { dbo } from '../api/dbo';

class DispositionDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      members:[],
      userDispos:[],
      canUpdate:false,
    }
  }
  componentDidMount=_=>{
    let members=[];
    this.props.dispo.members.map(uid=>{
      dbo.getUserData(uid).then(doc=>{
        members.push({id:uid,pseudo:doc.data().pseudo})
      }).then(_=>{
        this.setState({members:members})
      })
    })
    let userDispos = [];
    this.props.dispo.dates.map(date=>{
      if(date.available.includes(this.props.user.user.uid)){
        userDispos.push(true)
      }else{
        userDispos.push(false)
      }
    })
    this.setState({userDispos:userDispos})
    this.canUpdate()
  }
  changeDispo=(dates)=>{
    let uid = this.props.user.user.uid
    let dispoId = this.props.dispo.id
    dates.map((available,id)=>{
      if(available!==undefined){
        dbo.setDispos(uid,dispoId,id,available)
      }
    })
    this.setState({userDispos:dates})
  }
  canUpdate=_=>{
    dbo.userAsOrganizersPrivilege(this.props.dispo.group,this.props.user.user.uid).then(res=>{
      this.setState({canUpdate:res})
    })
  }
  createEvent=(data)=>{
    console.log('create');
    
  }
  render() {
    if(this.state.userDispos.length>0 && this.state.members.length>0){
      return (
        <DispositionDetails 
          dispo={this.props.dispo} 
          user={this.props.user}
          changeDispo={this.changeDispo}
          createEvent={this.createEvent}
          members={this.state.members}
          userDispos={this.state.userDispos}
          canUpdate={this.state.canUpdate}
        />
      );
    }else{
      return null
    }
  }
}
const mapStateToProps = state => ({
  dispo:state.dispo,
  user:state.user
});
export default connect (mapStateToProps)(DispositionDetailsScreen);
