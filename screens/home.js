import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ActionButton from 'react-native-action-button';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { db } from '../firebase'

class Home extends Component{
  createInDataBase=()=>{
    console.warn("clicked");
    db.collection('cities').doc('BJ').set({
    capital: true
    }, { merge: true });
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
        <Button
          title="Create in database"
          onPress={this.createInDataBase}
        />
      </View>
    )
  }
}
export default Home;
