import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ActionButton from 'react-native-action-button';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Home extends Component{

  sayHi(){
    console.log("hi");
  }

  render(){
    return(
      <View>
        <Text>Ecran home</Text>
        <Button
          title="Press me"
          onPress={() => this.props.navigation.navigate('EventForm')}
        />
      </View>
    )
  }
}
export default Home;
