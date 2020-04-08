import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableHighlight, Picker} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import ModalSelector from 'react-native-modal-selector'

import { connect } from 'react-redux'
import { setGroups } from '../redux/actions/setGroups';
import {selectGroup} from '../redux/actions/selectGroup';
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import {dbo} from '../dataObjects/dbo';

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
    dbo.editGroup(this.state.name,this.state.desc,this.state.categorie,this.props.group.id).then(_=>{
      //re-fetch les groups pour avoir les modifications
      let groupsIds=[];
      let groups=[];
      let uid = this.props.user.user.uid;
      dbo.getUserData(uid).then(doc=>{
        groupsIds=doc.data().groups;
        groupsIds.map(item=>{
          dbo.getGroupData(item).then(doc=>{
            groups.push({id:item,data:doc.data()});
            this.setState({groups:groups})
            this.props.setGroups(groups)
          })
        })
      })
      //mettre le bon group dans redux
      for(let i in this.props.groups){
        if(this.props.groups[i].id===this.props.group.id){
          this.props.selectGroup(this.props.groups[i]);
        }
      }
      this.props.navigation.goBack();
    });
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
          onValueChange={(itemValue, itemIndex) =>this.setState({categorie: itemValue})}
        >
          {this.state.categories.map(label =>{
            return (<Picker.Item label={label} value={label}/>)
          })}
        </Picker>
        <TouchableHighlight onPress={this.handleEdit}>
          <View style={styles.signUpButton}>
            <Text style={{color:'#ffffff'}}>Enregistrer</Text>
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
const mapStateToProps = state => ({
  categories: state.categories,
  group: state.group,
  groups: state.groups,
  user:state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setGroups,
      selectGroup
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(EditGroup);
