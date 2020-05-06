import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Picker} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Alert } from "react-native";

class EditGroup extends Component{
  constructor(props){
    super(props)
    this.state={
      name:'',
      desc:'',
      categorie:'',

      categories:[]
    }
  }
  componentDidMount(){
    this.setState({name:this.props.group.data.name})
    this.setState({desc:this.props.group.data.description})
    this.setState({categories:this.props.categories})
    this.setState({categorie:this.props.group.data.category})
  }
  handleEdit=()=>{
    if(this.state.name !== '' && this.state.categorie !== ''){
      this.props.handleEdit(this.state.name,this.state.desc,this.state.categorie,this.props.group.id);
    }else{
      Alert.alert(
        "Erreur",
        "Veuillez renseigner un nom et une catégorie",
        [
          {text: "Ok"}
        ],
        { cancelable: false }
      );
    }
  }
  render(){
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Text style={styles.title}>Modifier le groupe</Text>
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
        <Picker
          style={styles.picker}
          selectedValue={this.state.categorie}
          onValueChange={(itemValue) =>this.setState({categorie: itemValue})}
        >
          {this.state.categories.map(label =>{
            return (<Picker.Item key={label} label={label} value={label}/>)
          })}
        </Picker>
        <TouchableOpacity onPress={this.handleEdit}>
          <View style={styles.signUpButton}>
            <Text style={styles.whiteText}>Enregistrer</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
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
  signUpButton: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  picker:{
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

export default EditGroup;
