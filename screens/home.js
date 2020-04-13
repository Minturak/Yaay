import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { setCategories } from '../redux/actions/setCategories';
import { setInvitations } from '../redux/actions/setInvitations';
import { setGroups } from '../redux/actions/setGroups'
import { bindActionCreators } from 'redux';

import {dbo} from '../dataObjects/dbo';
import {db} from '../firebase';

class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      invitations:[],
      groups:[],
    }
  }
  componentDidMount(){
    if(this.props.categories===undefined){
      this.fetchCategories();
    }
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }else{
      this.snapshot();
    }
  }
  snapshot(){
    const doc = db.collection('users').doc(this.props.user.user.uid);
    const observer = doc.onSnapshot(doc=>{
      this.updateInvites(doc);
      this.updateGroups(doc);
    })
  }
  updateInvites=(doc)=>{
    let invites = doc.data().invitations||[];
    this.setState({invitations:invites});
    this.props.setInvitations(invites);
  }
  updateGroups=(doc)=>{
    let groupsIds = doc.data().groups||[];
    if(groupsIds.length>0){
      let groups=[];
      groupsIds.map(id=>{
        dbo.getGroupData(id).then(data=>{
          groups.push({data:data.data(),id:id})
          this.props.setGroups(groups);
        })
      })
    }
  }
  fetchCategories(){
    let categories=[];
    dbo.getCategories().then(doc=>{
      doc.data().labels.map(label=>{
        categories.push(label);
      })
      this.props.setCategories(categories);
    })
  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableHighlight onPress={()=>this.props.navigation.navigate('CreateEvent')}>
          <View style={styles.button}>
            <Text>Créer un événement</Text>
          </View>
        </TouchableHighlight>
        <Text>Bienvenue sur Yaay !</Text>
        {this.state.invitations.length>0 &&
          <TouchableHighlight onPress={()=>this.props.navigation.navigate('Invitations')}>
            <View style={styles.invitations}>
              <Text>Nouvels invitations !</Text>
            </View>
          </TouchableHighlight>
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    alignItems:'center',
  },
  invitations:{
    alignItems:'center',
    marginRight:wp('3%'),
    marginLeft:wp('3%'),
    width:wp('50%'),
    backgroundColor:'#249E6B',
    borderRadius:16,
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('4%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  },
});
const mapStateToProps = state => ({
  user: state.user,
  categories: state.categories,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setCategories,
      setInvitations,
      setGroups
    },
    dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(Home);
