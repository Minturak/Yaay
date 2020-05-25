/**
 * Affiche le formulaire pour s'inscrire
 */
import React, { Component } from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Item, Label, Input } from 'native-base'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Ionicons from "react-native-vector-icons/Ionicons"

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
  handleVisibility=_=>{
    let hidePassword = !this.state.hidePassword;
    this.setState({hidePassword})
  }
  handleConfirmVisibility=_=>{
    let hideConfirm = !this.state.hideConfirm;
    this.setState({hideConfirm})
  }
  handleSignUp=()=>{
    this.props.handleSignUp(this.state.email,this.state.password,this.state.confirm,this.state.pseudo);
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
        <View style={styles.pwdContainer}>
          <View style={styles.input}>
            <Item floatingLabel>
              <Label>Mot de passe</Label>
              <Input
                onChangeText={(text) => this.setState({password: text})}
                returnKeyType={"next"}
                secureTextEntry={this.state.hidePassword}
                autoCapitalize="none"
              />
            </Item>
          </View>
          <View style={styles.iconCheck}>
            <TouchableOpacity onPress={()=>this.handleVisibility()}>
              <Ionicons name={this.state.hidePassword?"md-eye":"md-eye-off"} size={25}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.pwdContainer}>
          <View style={styles.input}>
            <Item floatingLabel>
              <Label>Confirmer</Label>
              <Input
                onChangeText={(text) => this.setState({confirm: text})}
                returnKeyType={"next"}
                secureTextEntry={this.state.hideConfirm}
                autoCapitalize="none"
              />
          </Item>
          </View>
          <View style={styles.iconCheck}>
            <TouchableOpacity onPress={()=>this.handleConfirmVisibility()}>
              <Ionicons name={this.state.hideConfirm?"md-eye":"md-eye-off"} size={25}/>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={this.handleSignUp}>
          <View style={styles.signUpButton}>
            <Text style={styles.whiteText}>Inscription</Text>
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
  whiteText:{
    color:'#ffffff'
  },
  pwdContainer:{
    flexDirection:'row',
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
    marginTop: hp('4%'),
  },
  input:{
    flex:1,
  },
  iconCheck:{
    alignSelf:'center',
  }
});

export default SignUpForm;
