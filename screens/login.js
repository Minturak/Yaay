import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Alert } from "react-native";
import LoginForm from "../components/login-form"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { connect } from 'react-redux'
import { connectUser } from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';

class Login extends Component{
  toSignUp=()=>{
    this.props.navigation.navigate('SignUp')
  }
  handleLogin=(email,password)=>{
    dbo.handleLogin(email,password).then(user=>{
      this.props.connectUser(user);
      this.props.navigation.replace('Home');
    }).catch(error=>{
      Alert.alert(
        "Erreur",
        "L'email ou le mot de passe est incorrecte",
        [
          { text: "Ok"},
        ],
        { cancelable: false }
      );
    })
  }
  forgottenPassword=(email)=>{
    dbo.forgottenPassword(email).then(_=>{
      Alert.alert(
        "Récupération",
        "Un email vous a été envoyé avec un lien de récuppération de mot de passe",
        [
          { text: "Ok"},
        ],
        { cancelable: false }
      );
    })
    
  }
  render(){
    return(
      <View>
        <LoginForm 
          navigation={this.props.navigation} 
          connectUser={this.props.connectUser} 
          handleLogin={this.handleLogin}
          forgottenPassword={this.forgottenPassword}
        />
        <Text style={styles.textContent}>ou</Text>
        <TouchableOpacity onPress={this.toSignUp}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Créer un compte</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  textContent: {
    marginTop:hp('2%'),
    textAlign:'center'
  },
  button:{
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  signUpButton: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('2%'),
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
