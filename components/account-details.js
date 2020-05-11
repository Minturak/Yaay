import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class AccountDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mon profil</Text>
        <Text style={[styles.centerText, styles.paddingText]}>{this.props.user.email}</Text>
        {!this.props.validated && 
          <View>
            <Text style={styles.paddingText}>Votre adresse email n'a pas été validée</Text>
            <TouchableOpacity onPress={this.props.resendEmail}>
              <Text style={[styles.textLink, styles.paddingText]}>Me renvoyer l'email</Text>
            </TouchableOpacity>
          </View>
        }
        <Text style={[styles.centerText, styles.paddingText]}>{this.props.user.pseudo}</Text>
        <TouchableOpacity onPress={this.props.disconnect} style={styles.button}>
          <Text style={styles.whiteText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  title:{
    marginTop:hp('2%'),
    marginBottom:hp('1%'),
    fontSize:32,
    textAlign:'center',
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginBottom: hp('3%')
  },
  whiteText:{
    color:'#ffffff'
  },
  centerText:{
    alignSelf:'flex-start'
  },
  textLink:{
    color:'#0000ff',
    textDecorationLine:'underline'
  },
  paddingText:{
    marginBottom:hp('1%')
  }
});
export default AccountDetails;
