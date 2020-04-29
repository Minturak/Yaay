import React, { Component } from 'react';
import {Item, Label, Input } from 'native-base'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Ionicons from "react-native-vector-icons/Ionicons"

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
              <Text key={key}>{user.data.pseudo}</Text>
            )
          })}
        </View>
        <Text style={styles.subTitle}>Organisateurs : </Text>
        <View style={styles.usersList}>
          {this.props.organizers.map((user,key)=>{
            return(
              <Text key={key}>{user.data.pseudo}</Text>
            )
          })}
        </View>
        <Text style={styles.subTitle}>Membres : </Text>
        <View style={styles.usersList}>
          {this.props.members.map((user,key)=>{
            return(
              <Text key={key}>{user.data.pseudo}</Text>
            )
          })}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
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
  },
  usersList:{
    marginLeft:wp('2%')
  },
});

export default GroupDetails;
