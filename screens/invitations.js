/**
 * Gère la logique pour afficher les invitations
 * Gère la logique pour accepter ou refuser une invitation
 */
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import Invitation from '../components/invitation';

import { connect } from 'react-redux'

import {dbo} from '../api/dbo';
import {db} from '../firebase';

class Invitations extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  snapshot(){
    db.collection('users').doc(this.props.user.user.uid).onSnapshot(doc=>{
        this.updateList(doc.data());
    })
  }
  updateList=(data)=>{
    this.fetchGroups(data.invitations);
  }
  fetchGroups=(groupsIds)=>{
    let groups = [];
    if(groupsIds.length>0){
      groupsIds.map(idGroup=>{
        dbo.getGroupData(idGroup).then(doc=>{
          groups.push({id:doc.id,data:doc.data()});
          this.setState({groups:groups})
        })
      })
    }else{
      this.props.navigation.navigate('Home');
    }
  }
  componentDidMount(){
    this.fetchGroups(this.props.invitations);
    this.snapshot();
  }
  acceptInvitation=(id)=>{
    dbo.addMemberToGroup(this.props.user.user.uid,id);
    dbo.removeInvitation(this.props.user.user.uid,id);
    dbo.getUserData(this.props.user.user.uid)
  }
  refuseInvitation=(id)=>{
    dbo.removeInvitation(this.props.user.user.uid,id);
  }
  render(){
    return(
      <View>
        <FlatList
          data={this.state.groups}
          renderItem={({item})=><Invitation group={item} acceptInvitation={this.acceptInvitation} refuseInvitation={this.refuseInvitation}/>}
          />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  invitations: state.invitations,
  user: state.user,
});
export default connect(mapStateToProps)(Invitations);
