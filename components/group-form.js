import React, { Component, Fragment } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableHighlight, Picker} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import ModalSelector from 'react-native-modal-selector'
import { db } from '../firebase'

class GroupForm extends Component{
  constructor(props){
    super(props)
    this.state={
      name:'',
      desc:'',
      categorie:'',

      categories:[]
    }
  }
  handleSubmit(){
  }
  componentDidMount(){

    let categ = [];
    let cat = db.collection('constants').doc('categories')
    cat.get({source:'server'}).then(doc => {
      doc.data().labels.map(label=>{
        categ.push(label);
      })
      this.setState({categories: categ})
      // console.log(categ);
    }).catch(function(error){
      console.log('error : '+error);
    })

  }
  render(){
    let categ=[];
    let index = -1;
    categ.push({key:index,section:true,label:'Catégorie'});
    this.state.categories.forEach(function(categorie, i){
      categ.push({key:i, label:categorie});
    })
    return(
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <Text style={styles.title}>Nouveau groupe</Text>
        <Item floatingLabel style={styles.itemContainer}>
            <Label>Nom</Label>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({name: text})}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
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
            />
        </Item>
        <Picker
          style={styles.picker}
          selectedValue={this.state.categorie}
          onValueChange={(itemValue, itemIndex) =>this.setState({categorie: itemValue})}
        >
          {this.state.categories.map(label =>{
            return (<Picker.Item label={label} value={label}/>)
          })}
        </Picker>
        <TouchableHighlight onPress={this.handleSubmit}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Créer</Text>
          </View>
        </TouchableHighlight>
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
    backgroundColor: '#3694cf',
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
});
export default GroupForm;
