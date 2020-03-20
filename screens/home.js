import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ActionButton from 'react-native-action-button';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { db } from '../firebase'

class Home extends Component{
  componentDidMount(){
    if(this.props.user == undefined){
      this.props.navigation.replace('Login')
    }
  }
  render(){
    return(
      <View>
        <Text>Ecran home</Text>
        <Button
          title="To event"
          onPress={() => this.props.navigation.navigate('EventForm')}
        />
        <Button
          title="To login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
export default Home;
