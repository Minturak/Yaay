import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableHighlight} from 'react-native';
import {Item, Label, Input } from 'native-base'
import {TextField} from '@material-ui/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { connectUser } from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import { db } from '../firebase'
import {dbo} from '../dataObjects/dbo';

class SignUpForm extends Component{
  constructor(props){
    super(props)
    this.state={
      hidePassword: true,
      hideConfirm: true,
      password:"",
      confirm:"",
      email:"",
      pseudo:"",
    }
  }
  handleVisibility=()=>{
    let showPassword = !this.state.showPassword;
    this.setState({showPassword})
  }
  handleSignUp=()=>{
    const{email, password} = this.state
    dbo.handleSignUp(email,password)
      .then(user=>{
         var user = firebase.auth().currentUser;
         let uid = user.uid;
         let name = this.state.pseudo;
         dbo.createUserDocument(uid,name);
         this.props.connectUser(user);
         this.props.navigation.replace('Home');
      })
  }
  render(){
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Pseudonyme</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({pseudo: text})}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>E-mail</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Mot de passe</Label>
            <Input
              onChangeText={(text) => this.setState({password: text})}
              returnKeyType={"next"}
              secureTextEntry={this.state.hidePassword}
              autoCapitalize="none"
            />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Confirmer</Label>
            <Input
              onChangeText={(text) => this.setState({confirm: text})}
              returnKeyType={"next"}
              secureTextEntry={this.state.hideConfirm}
              autoCapitalize="none"
            />
        </Item>
        <TouchableHighlight onPress={this.handleSignUp}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Inscription</Text>
          </View>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  itemContainer: {
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  signUpButton: {
    backgroundColor: '#3694cf',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
});
const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      connectUser
    },
    dispatch,
)
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
