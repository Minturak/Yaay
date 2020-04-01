import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import {dbo} from '../dataObjects/dbo';

class Invitation extends Component{
  constructor(props){
    super(props)
    this.state={
      group:this.props.group
    }
  }
  componentDidMount(){

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
          <TouchableHighlight onPress={()=>this.acceptInvitation()}>
            <View style={styles.button}><Text>Accepter</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>this.refuseInvitation()}>
            <View style={styles.button}><Text>Refuser</Text></View>
          </TouchableHighlight>
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
  button:{
    alignItems:'center',
    marginRight:wp('3%'),
    marginLeft:wp('3%'),
    width:wp('30%'),
    backgroundColor:'#cccccc',
    borderRadius:16,
    flex:1,
  },
});
export default Invitation;
