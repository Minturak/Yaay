import React, { Component } from 'react';
import SignUpForm from "../components/signup-form";
import { Alert } from "react-native";
import { connect } from 'react-redux'
import { connectUser } from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';

class SignUp extends Component{
  handleSignUp=(email,password,confirm,pseudo)=>{
    if(email.length<=0||pseudo.length<=0||password!==confirm){
      Alert.alert(
        "Erreur",
        "Veullez remplir les champs correctement",
        [
          { text: "Ok"},
        ],
        { cancelable: false }
      );
    }else{
      dbo.handleSignUp(email,password).then(user=>{
        let uid = user.user.uid;
        dbo.sendEmailVerification()
        dbo.createUserDocument(uid,pseudo,email);
        this.props.connectUser(user);
        this.props.navigation.pop();
        this.props.navigation.replace('Home');
      }).catch(error=>{
        Alert.alert(
          "Erreur",
          "Erreur : "+error.message,
          [
            { text: "Ok"},
          ],
          { cancelable: false }
        );
      })
    }
  }
  render(){
    return(
      <SignUpForm handleSignUp={this.handleSignUp}/>
    )
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      connectUser
    },
    dispatch,
)
export default connect(null,mapDispatchToProps)(SignUp);
