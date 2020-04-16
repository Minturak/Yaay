import React, { Component, Fragment } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Picker} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

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
  handleSubmit=()=>{
    if(this.state.name !== '' && this.state.categorie !== ""){
      this.props.handleSubmit(this.state.name,this.state.desc,this.state.categorie)
    }else{
      //raise error
    }
  }
  componentDidMount(){
    this.setState({categories:this.props.categories});
  }
  render(){
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
            return (<Picker.Item key={label} label={label} value={label}/>)
          })}
        </Picker>
        <TouchableOpacity onPress={this.handleSubmit}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Créer</Text>
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
});

export default GroupForm;
