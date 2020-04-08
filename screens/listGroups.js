import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import GroupCard from '../components/group-card'

import { connect } from 'react-redux'
import { setGroups } from '../redux/actions/setGroups';
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import {dbo} from '../dataObjects/dbo';
import {db} from '../firebase';

class ListGroups extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  listener(uid){
    const doc = db.collection('users').doc(uid).onSnapshot(doc=>{
      let groupsIds = doc.data().groups;
      if(!groupsIds.length>0){this.setState({groups:[]})}
      let groups = [];
      groupsIds.map(item=>{
        dbo.getGroupData(item).then(group=>{
          groups.push({id:item,data:group.data()});
          this.setState({groups:groups});
          this.props.setGroups(groups);
        })
      })
    })
  }
  componentDidMount(){
    if(this.props.user===undefined){
      this.props.navigation.navigate('Home')
    }
    var uid = firebase.auth().currentUser.uid;
    if(this.props.groups===undefined){
      this.fetchGroups(uid);
    }else{
      this.setState({groups:this.props.groups})
    }
    this.listener(uid);
  }
  fetchGroups=(uid)=>{
    let groupsIds=[];
    let groups=[];
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
  }
  render(){
    return(
      <View>
        <Button color="#249E6B" title="create group" onPress={()=>this.props.navigation.navigate('GroupFormScreen')}/>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => <GroupCard groupData={item} navigation={this.props.navigation}/>}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  buttonStyle:{
    backgroundColor: '#249E6B',
  },
});
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setGroups
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(ListGroups);
