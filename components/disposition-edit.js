import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity,} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Alert } from "react-native";

class DispositionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:this.props.dispo.name,
      desc:this.props.dispo.desc
    };
  }
  handleEdit=_=>{
    if(this.state.name.length<1){
      Alert.alert(
        "Erreur",
        "Le nom ne peut pas être vide",
        [
          {text: "Ok"}
        ],
        { cancelable: false }
      );
    }else{
      this.props.handleEdit(this.state)
    }
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Text style={styles.title}>Modifier la disponibilité</Text>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Nom</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({name: text})}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
              value={this.state.name}
            />
        </Item>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Description</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({desc: text})}
              autoCapitalize="sentences"
              multiline={true}
              autoCorrect={false}
              returnKeyType="next"
              value={this.state.desc}
            />
        </Item>
        <TouchableOpacity onPress={this.handleEdit}>
          <View style={styles.button}>
            <Text style={styles.whiteText}>Enregistrer</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  itemContainer: {
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  title:{
    marginTop:hp('4%'),
    fontSize: 32,
    textAlign:'center'
  },
  whiteText:{
    color:'#ffffff'
  }
});
export default DispositionEdit;
