import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { db } from '../firebase'

class GroupDetails extends Component{
  constructor(props){
    super(props)
    this.state={
      members:[]
    }
  }
  componentDidMount(){
    const { groupData } = this.props.route.params;
    //console.log(groupData);
    var grpId = groupData.id;
    let membersIds = groupData.data.members;
    let members = [];
    membersIds.map(id=>{
      db.collection('users').doc(id).get().then(doc=>{
        members.push({id:id,data:doc.data()});
        this.setState({members:members})
      });

    })
  }
  render(){
    console.log(this.props.route.params);
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.route.params.groupData.data.name}</Text>
        <Text>Catégorie : {this.props.route.params.groupData.data.category}</Text>
        <Text>Description du groupe : {this.props.route.params.groupData.data.description}</Text>
        {this.state.members.map(user=>{
          return(
              <Text>{user.data.pseudo}</Text>
          )
        })}
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
  title:{
    fontSize:22,
    marginBottom:hp('2%')
  },
});
export default GroupDetails;
