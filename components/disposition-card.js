/**
 * Affiche les disposition sous forme de cartes
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen';
  import moment from 'moment'

class DispositionCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let dispo = this.props.dispo
    //filtre les dispos passées
    if(moment(dispo.dates[5].date).isBefore(moment(new Date()),'day')){
      return null
    }
    return (
      <TouchableOpacity onPress={()=>this.props.selectDispo(dispo.id)}>
        <View style={styles.container}>
          <Text style={styles.title}>{dispo.name}</Text>
        </View>
      </TouchableOpacity>
    );
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
    width:wp('90%'),
  },
  title:{
    fontSize:18
  },
})
export default DispositionCard;
