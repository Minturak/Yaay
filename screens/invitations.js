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

class Invitations extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  componentDidMount(){
    let groups = this.state.groups;
    this.props.invitations.map(idGroup=>{
      dbo.getGroupData(idGroup).then(doc=>{
        groups.push({id:doc.id,data:doc.data()});
        this.setState({groups:groups})
      })
    })
  }
  acceptInvitation=(id)=>{
    console.log('accepter pour '+id);
    dbo.addMemberToGroup(this.props.user.user.uid,id);
    dbo.removeInvitation(this.props.user.user.uid,id);
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
