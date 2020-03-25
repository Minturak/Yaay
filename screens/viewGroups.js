import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class ViewGroups extends Component{
  render(){
    return(
      <View>
        <Button title="create group" onPress={()=>this.props.navigation.navigate('GroupForm')}/>
      </View>
    )
  }
}
export default ViewGroups;
