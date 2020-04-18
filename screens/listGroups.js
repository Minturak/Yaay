import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';
import GroupCard from '../components/group-card'

import { connect } from 'react-redux'
import { setGroups } from '../redux/actions/setGroups';
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import {dbo} from '../api/dbo';
import {db} from '../firebase';

class ListGroups extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  componentDidMount(){
    if(this.props.user===undefined){
      this.props.navigation.navigate('Home')
    }
    var uid = firebase.auth().currentUser.uid;
    this.listenerUser(uid);
  }
  listenerGroups(groupId){
    const doc = db.collection('groups').doc(groupId).onSnapshot(doc=>{
      let groups = this.state.groups;
      let index = -1;
      if(groups.length>0){
        index = groups.findIndex(group=>group.id===groupId);
        if(index>-1){
            groups[index] = {id:groupId,data:doc.data()};
        }
      }
    })
  }
  listenerUser(uid){
    const doc = db.collection('users').doc(uid).onSnapshot(doc=>{

      let groupsIds = doc.data().groups;
      if(groupsIds!==undefined){
          if(!groupsIds.length>0){
            this.setState({groups:[]})
          }
          let groups = [];
          groupsIds.map(item=>{
            this.listenerGroups(item)
            dbo.getGroupData(item).then(group=>{
              groups.push({id:item,data:group.data()});
              this.setState({groups:groups});
              this.props.setGroups(groups);
            })
          })
      }
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
