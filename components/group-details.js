import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Ionicons from "react-native-vector-icons/Ionicons"
import UserDisplay from './user-display'

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleAndIcons}>
            <Text style={styles.title}>{group.data.name}</Text>
            {this.props.isAdmin && 
              <View style={styles.icons}>
                <TouchableOpacity onPress={()=>{this.setState({addingUser:!this.state.addingUser})}}>
                  <Ionicons name={"md-person-add"} size={25} style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditGroupScreen')}>
                  <Ionicons name={"md-create"} size={25} style={styles.icon}/>
                </TouchableOpacity>
              </View>
            }
          </View>
          <Text>Catégorie : {group.data.category}</Text>
          <Text>Description du groupe : {group.data.description}</Text>
        </View>
        {this.state.addingUser &&
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Item floatingLabel style={styles.itemContainer}>
                  <Label>Email de l'utilisateur</Label>
                  <Input
                    onChangeText={(text) => this.setState({addingEmail: text})}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={()=>this.addUser()}
                  />
              </Item>
            </View>
            <View style={styles.iconCheck}>
              <TouchableOpacity onPress={()=>this.addUser()}>
                <Ionicons name={"md-checkmark"} size={25}/>
              </TouchableOpacity>
            </View>
          </View>
        }
        <Text style={styles.subTitle}>Administrateurs : </Text>
        <View style={styles.usersList}>
          {this.props.admins.map((user,key)=>{
            return(
              <UserDisplay
                key={key}
                user={user}
                role={0}
                setUserRole={this.props.setUserRole}
                isAdmin={this.props.isAdmin}
                nbAdmins={this.props.admins.length}
                removeUser={this.props.removeUser}
              />
            )
          })}
        </View>
        <Text style={styles.subTitle}>Organisateurs : </Text>
        <View style={styles.usersList}>
          {this.props.organizers.map((user,key)=>{
            return(
              <UserDisplay
                key={key}
                user={user}
                role={1}
                setUserRole={this.props.setUserRole}
                isAdmin={this.props.isAdmin}
                removeUser={this.props.removeUser}
              />
            )
          })}
        </View>
        <Text style={styles.subTitle}>Membres : </Text>
        <View style={styles.usersList}>
          {this.props.members.map((user,key)=>{
            return(
              <UserDisplay
                key={key}
                user={user} 
                role={2}
                setUserRole={this.props.setUserRole}
                isAdmin={this.props.isAdmin}
                removeUser={this.props.removeUser}
              />
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding:wp('4%'),
  },
  header:{
    borderBottomWidth:1,
    borderColor:'#249E6B',
    paddingBottom:hp('1%'),
    marginBottom:hp('1%'),
  },
  title:{
    fontSize:22,
    marginBottom:hp('2%'),
    fontWeight:'bold',
    flex:1
  },
  titleAndIcons:{
    flexDirection:'row',
  },
  icons:{
    alignSelf:'flex-end',
    flexDirection:'row',
  },
  icon:{
    marginHorizontal:wp('2%'),
    color:"#444444",
    marginBottom:hp('2%'),
  },
  inputContainer:{
    flexDirection:'row'
  },
  input:{
    flex:1
  },
  iconCheck:{
    alignSelf:'center'
  },
  subTitle:{
    fontWeight:'bold',
    marginTop:hp('1%')
  },
  usersList:{
    marginLeft:wp('2%'),
  },
});

export default GroupDetails;
