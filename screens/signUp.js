import React, { Component } from 'react';
import SignUpForm from "../components/signup-form";

import { connect } from 'react-redux'
import { connectUser } from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';

class SignUp extends Component{
  handleSignUp=(email,password,pseudo)=>{
    dbo.handleSignUp(email,password)
      .then(user=>{
         let uid = user.user.uid;
         dbo.createUserDocument(uid,pseudo,email);
         this.props.connectUser(user);
         this.props.navigation.replace('Home');
      })
  }
  render(){
    return(
      <SignUpForm navigation={this.props.navigation} handleSignUp={this.handleSignUp}/>
    )
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      connectUser
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(SignUp);
