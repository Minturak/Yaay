import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ActionButton from 'react-native-action-button';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Home extends Component{

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
export default Home;
