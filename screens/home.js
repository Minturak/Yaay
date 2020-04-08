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
import { bindActionCreators } from 'redux';

import {dbo} from '../dataObjects/dbo';
import {db} from '../firebase';

class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      invitations:[],
    }
  }
  componentDidMount(){
    if(this.props.categories===undefined){
      this.fetchCategories();
    }
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }else{
      console.log(this.props.user);
      this.snapshot();
      this.fetchInvitations();
    }
  }
  snapshot(){
    const doc = db.collection('users').doc(this.props.user.user.uid);
    const observer = doc.onSnapshot(doc=>{
      this.updateInvites(doc);
    })
  }
  updateInvites=(doc)=>{
    let invites = doc.data().invitations||[];
    this.setState({invitations:invites});
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
  fetchInvitations=()=>{
    dbo.getUserData(this.props.user.user.uid).then(doc=>{
      let invitations = doc.data().invitations || [];
      this.setState({invitations:invitations})
      this.props.setInvitations(invitations);
    })
  }
  render(){
    return(
      <View style={styles.container}>
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
});
const mapStateToProps = state => ({
  user: state.user,
  categories: state.categories,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setCategories,
      setInvitations
    },
    dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(Home);
