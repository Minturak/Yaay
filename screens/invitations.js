import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import Invitation from '../components/invitation';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { setCategories } from '../redux/actions/setCategories';
import { setInvitations } from '../redux/actions/setInvitations';
import { bindActionCreators } from 'redux';

import {dbo} from '../dataObjects/dbo';
import {db} from '../firebase';

class Invitations extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  snapshot(){
    const doc = db.collection('users').doc(this.props.user.user.uid);
    const observer = doc.onSnapshot(doc=>{
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
    console.log(this.props);
    this.fetchGroups(this.props.invitations);
    this.snapshot();
  }
  acceptInvitation=(id)=>{
    dbo.addMemberToGroup(this.props.user.user.uid,id);
    dbo.removeInvitation(this.props.user.user.uid,id);
    dbo.getUserData(this.props.user.user.uid).then(doc=>{
      dbo.addGroupToUser(this.props.user.user.uid,doc,id);
    })
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
