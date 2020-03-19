import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import LoginForm from "../components/login-form"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class Login extends Component{
  redirectte=()=>{
    console.warn("touched");
    this.props.navigation.navigate('SignUp');
  }
  render(){
    return(
      <View>
        <LoginForm/>
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
export default Login;
