import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log(this.props.user);
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mon profil</Text>
        <Text style={styles.centerText}>{this.props.user.email}</Text>
        <Text style={styles.centerText}>{this.props.user.pseudo}</Text>
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
});
export default AccountDetails;
