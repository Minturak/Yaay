import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import LoginForm from "../components/login-form"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { connectUser } from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

class Login extends Component{
  redirectte=()=>{
    console.log('redi');
    this.props.navigation.navigate('SignUp');
  }
  componentDidMount(){
    console.log(this.props);
  }
  render(){
    return(
      <View>
        <LoginForm navigation={this.props.navigation} connectUser={this.props.connectUser}/>
        <View style={styles.container}>
          <Text> ou </Text>
          <TouchableHighlight onPress={this.redirectte}>
            <View>
              <Text style={{textDecorationLine:'underline',color:'#343deb', fontSize:18}}>
                Créer un compte
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: hp('2%'),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
