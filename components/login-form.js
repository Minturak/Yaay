import React, { Component, Fragment } from 'react';
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Item, Label, Input } from 'native-base'
import {TextField} from '@material-ui/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class LoginForm extends Component{
  constructor(props){
    super(props)
    this.state={
      hidePassword: true,
      hideConfirm: true,
      password:"",
      confirm:"",
      email:"",
    }
  }
  handleVisibility=()=>{
    let showPassword = !this.state.showPassword;
    this.setState({showPassword})
  }
  handleLogin=()=>{
    if(this.state.password !== "" && this.state.email !== ""){
      this.props.handleLogin(this.state.email,this.state.password);
    }
  }
  render(){
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
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
        <TouchableOpacity onPress={this.handleLogin}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Connexion</Text>
          </View>
        </TouchableOpacity>
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
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
});

export default LoginForm;
