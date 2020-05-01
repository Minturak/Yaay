import React, { Component } from 'react';
import GroupForm from "../components/group-form"

import { connect } from 'react-redux'

import firebase from "firebase";
import {dbo} from '../api/dbo';

class GroupFormScreen extends Component{
  handleSubmit=(name,desc,cat)=>{
    var idUser = firebase.auth().currentUser.uid;
    //création du groupe
    dbo.createGroup(name,desc,cat,idUser)
      .then(docRef=>{
      //ajout du groupe dans l'utilisateur
      dbo.getUserData(idUser).then(doc => {
        dbo.addGroupToUser(idUser,doc,docRef.id);
      })
    });
    this.props.navigation.navigate('ListGroups');
  }
  render(){
    return(
      <GroupForm handleSubmit={this.handleSubmit} categories={this.props.categories}/>
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories,
  group: state.group,
});
export default connect(mapStateToProps)(GroupFormScreen);
