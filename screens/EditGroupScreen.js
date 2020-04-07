import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EditGroup from "../components/edit-group"

class EditGroupScreen extends Component{
  render(){
    return(
      <EditGroup navigation={this.props.navigation}/>
    )
  }
}

export default EditGroupScreen;
