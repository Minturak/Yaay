import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

class GroupDetails extends Component{
  constructor(props){
    super(props)
    this.state = {
      addingUser:false,
      addingEmail:"",
    }
  }
  addUser=_=>{
    this.props.addUser(this.state.addingEmail);
    this.setState({addingUser:!this.state.addingUser})
  }
  render(){
    let group = this.props.group;
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{group.data.name}</Text>
        <Text>Catégorie : {group.data.category}</Text>
        <Text>Description du groupe : {group.data.description}</Text>
        <Text>Administrateurs : </Text>
        {this.props.admins.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        <Text>Organisateurs : </Text>
        {this.props.organizers.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        <Text>Membres : </Text>
        {this.props.members.map((user,key)=>{
          return(
              <Text key={key}>{user.data.pseudo}</Text>
          )
        })}
        {!this.state.addingUser &&
          <TouchableOpacity onPress={()=>{this.setState({addingUser:!this.state.addingUser})}}>
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

export default GroupDetails;
