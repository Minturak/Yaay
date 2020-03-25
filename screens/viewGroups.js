import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import GroupCard from '../components/group-card'

import firebase from "firebase";
import { db } from '../firebase'

class ViewGroups extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  componentDidMount(){
    var uid = firebase.auth().currentUser.uid;
    let groupsIds=[];
    let groups=[];
    db.collection('users').doc(uid).get()
      .then(doc =>{
        groupsIds = doc.data().groups;
        groupsIds.map(item=>{
          db.collection('groups').doc(item).get().then(doc=>{
            groups.push(doc.data());
            this.setState({groups:groups})
          });
        })

    });
  }
  render(){
    return(
      <View>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => <GroupCard groupData={item} />}
        />
        <Button title="create group" onPress={()=>this.props.navigation.navigate('GroupForm')}/>
      </View>
    )
  }
}
export default ViewGroups;
