import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignUpForm from "../components/signup-form";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class SignUp extends Component{
  render(){
    return(
      <SignUpForm navigation={this.props.navigation}/>
    )
  }
}
export default SignUp;
