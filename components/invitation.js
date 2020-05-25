/**
 * Affiche une invitation avec les boutons pour accepter ou refuser
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class Invitation extends Component{
  constructor(props){
    super(props)
    this.state={
      group:this.props.group
    }
  }
  acceptInvitation(){
    this.props.acceptInvitation(this.state.group.id);
  }
  refuseInvitation(){
    this.props.refuseInvitation(this.state.group.id);
  }
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.group.data.name}</Text>
        <View style={styles.align}>
          <TouchableOpacity onPress={()=>this.acceptInvitation()}>
            <View style={styles.buttonAccept}><Text>Accepter</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.refuseInvitation()}>
            <View style={styles.buttonRefuse}><Text>Refuser</Text></View>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop:hp('2%'),
    marginLeft:wp('3%'),
    marginRight:wp('3%'),
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:16,
    padding:hp('2%'),

  },
  align:{
    flexDirection:'row',
    justifyContent:'center',
  },
  title:{
    fontSize:18,
  },
  buttonRefuse:{
    alignItems:'center',
    marginRight:wp('3%'),
    marginLeft:wp('3%'),
    width:wp('30%'),
    backgroundColor:'#cccccc',
    borderRadius:16,
    flex:1,
  },
  buttonAccept:{
    alignItems:'center',
    marginRight:wp('3%'),
    marginLeft:wp('3%'),
    width:wp('30%'),
    backgroundColor:'#249E6B',
    borderRadius:16,
    flex:1,
  }
});
export default Invitation;
