import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import {Item, Label, Input } from 'native-base'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { connect } from 'react-redux'
import { selectGroup } from '../redux/actions/selectGroup'
import { bindActionCreators } from 'redux';

import { dbo } from '../dataObjects/dbo';
import firebase from "firebase";
import {db} from '../firebase';

class GroupDetails extends Component{
  constructor(props){
    super(props)
    this.state={
      admins:[],
      organizers:[],
      members:[],
      addingUser:false,
      addingEmail:"",
    }
  }
  getAdmins(){
    let adminsId=this.props.group.data.admins;
    let admins=[];
    adminsId.map(id=>{
      dbo.getUserData(id).then(doc=>{
        admins.push({id:id,data:doc.data()});
        this.setState({admins:admins})
      })
    })
  }
  getOrganizers(){
    let orgaId=this.props.group.data.organizers;
    let orga=[];
    if(orgaId!==undefined){
      orgaId.map(id=>{
        dbo.getUserData(id).then(doc=>{
          admins.push({id:id,data:doc.data()});
          this.setState({organizers:orga})
        })
      })
    }
  }
  getMembers(){
    let membersIds = this.props.group.data.members;
    let members = [];
    if(membersIds!==undefined){
      membersIds.map(id=>{
        dbo.getUserData(id).then(doc=>{
          members.push({id:id,data:doc.data()});
          this.setState({members:members})
        });
      })
    }
  }
  handleAdding(){
    let addingUser=!this.state.addingUser;
    this.setState({addingUser:addingUser});
  }
  test_snapshot(){
    const doc = db.collection('groups').doc(this.props.group.id);
    const observer = doc.onSnapshot(docSnapshot=>{
      this.update(docSnapshot.data());
    })
  }
  update=(data)=>{
    //mettre à jour l'affichage
    this.props.selectGroup({data:data,id:this.props.group.id});
  }
  addUser=()=>{
    if(this.state.addingEmail!=="" && this.state.addingEmail!==undefined){
      dbo.getUserWithEmail(this.state.addingEmail).then(doc=>{
        if(doc.empty){
          console.log('Aucun utilisateur inscrit avec cet email!');
        }else{
          doc.forEach(user=>{
            dbo.addInvitationToUser(user.id,this.props.group.id,user.data()).then(_=>{
              this.handleAdding();
            })
          })
        }
      })
    }
  }
  componentDidMount(){
    this.getAdmins();
    this.getOrganizers();
    this.getMembers();
    this.test_snapshot();
  }
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.group.data.name}</Text>
        <Text>Catégorie : {this.props.group.data.category}</Text>
        <Text>Description du groupe : {this.props.group.data.description}</Text>
        <Text>Administrateurs : </Text>
        {this.state.admins.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        <Text>Organisateurs : </Text>
        {this.state.organizers.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        <Text>Membres : </Text>
        {this.state.members.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        {!this.state.addingUser &&
          <TouchableOpacity onPress={()=>this.handleAdding()}>
            <View style={styles.AddButton}>
              <Text style={{color:'#ffffff'}}>Ajouter un utilisateur</Text>
            </View>
          </TouchableOpacity>
        }
        {this.state.addingUser &&
          <View>
            <Item floatingLabel style={styles.itemContainer}>
                <Label>Email de l'utilisateur</Label>
                <Input
                  style={styles.input}
                  onChangeText={(text) => this.setState({addingEmail: text})}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={()=>this.addUser()}
                />
            </Item>
            <TouchableOpacity onPress={()=>this.addUser()}>
              <View style={styles.AddButton}>
                <Text style={{color:'#ffffff'}}>Valider</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditGroupScreen')}>
          <View style={styles.AddButton}>
            <Text style={{color:'#ffffff'}}>Modifier</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:wp('4%'),
  },
  AddButton: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
  title:{
    fontSize:22,
    marginBottom:hp('2%')
  },
});
const mapStateToProps = state => ({
  group: state.group,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectGroup,
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(GroupDetails);
