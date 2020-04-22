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
  render() {
    return (
      <DispositionDetails 
        dispo={this.props.dispo} 
        user={this.props.user}
        changeDispo={this.changeDispo}
        members={this.state.members}
        userDispos={this.state.userDispos}
      />
    );
  }
}
const mapStateToProps = state => ({
  dispo:state.dispo,
  user:state.user
});
export default connect (mapStateToProps)(DispositionDetailsScreen);
