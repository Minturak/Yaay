import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { db } from '../firebase'
import { connect } from 'react-redux'

class Home extends Component{
  componentDidMount(){
    if(this.props.user.user === undefined){
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
        
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height:hp('100%')
  },
  floating:{
    position: 'absolute',
    bottom: 10,
    right: 10,
  }
});
const mapStateToProps = state => ({
  user: state.user,
});

export default connect (mapStateToProps)(Home);
