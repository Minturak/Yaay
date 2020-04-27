import React, { Component } from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Item, Label, Input } from 'native-base'
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

      errorEmail:false,
    }
  }
  handleVisibility=()=>{
    let showPassword = !this.state.showPassword;
    this.setState({showPassword})
  }
  forgottenPassword=_=>{
    if(this.state.email.length==0){
      this.setState({errorEmail:true})
    }else{
      this.setState({errorEmail:false})
      this.props.forgottenPassword(this.state.email)
    }
  }
  handleLogin=()=>{
    if(this.state.password !== "" && this.state.email !== ""){
      this.props.handleLogin(this.state.email,this.state.password);
    }
  }
  render(){
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Item floatingLabel style={[styles.itemContainer,this.state.errorEmail&&styles.error]}>
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
        <TouchableOpacity onPress={this.forgottenPassword} style={styles.forgotPwd}>
          <Text style={styles.textPwd}>Mot de passe oublié</Text>
        </TouchableOpacity>
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
  forgotPwd:{
    alignItems:'center',
  },
  textPwd:{
    color:'#0000ff',
    textDecorationLine:'underline'
  },
  error:{
    borderBottomWidth:1,
    borderColor:'red'
  }
});

export default LoginForm;
