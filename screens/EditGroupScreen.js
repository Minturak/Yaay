import React, { Component, Fragment } from 'react';
import EditGroup from "../components/edit-group"

import { connect } from 'react-redux'
import { setGroups } from '../redux/actions/setGroups';
import { selectGroup } from '../redux/actions/selectGroup';
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import {dbo} from '../api/dbo';

class EditGroupScreen extends Component{
  handleEdit=(name,desc,cat,id)=>{
    dbo.editGroup(name,desc,cat,id).then(_=>{
      //re-fetch les groups pour avoir les modifications
      let groupsIds=[];
      let groups=[];
      let uid = this.props.user.user.uid;
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
      //mettre le bon group dans redux
      for(let i in this.props.groups){
        if(this.props.groups[i].id===this.props.group.id){
          this.props.selectGroup(this.props.groups[i]);
        }
      }
      this.props.navigation.goBack();
    });
  }
  render(){
    return(
      <EditGroup handleEdit={this.handleEdit} navigation={this.props.navigation} group={this.props.group} categories={this.props.categories}/>
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories,
  group: state.group,
  groups: state.groups,
  user:state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setGroups,
      selectGroup
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(EditGroupScreen);
