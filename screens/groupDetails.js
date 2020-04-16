import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux'
import { selectGroup } from '../redux/actions/selectGroup'
import { bindActionCreators } from 'redux';

import GroupDetails from "../components/group-details";

import { dbo } from '../dataObjects/dbo';
import firebase from "firebase";
import {db} from '../firebase';

class GroupDetailsScreen extends Component{
  constructor(props){
    super(props)
    this.state={
      admins:[],
      organizers:[],
      members:[],
    }
  }
  getAdmins(){
    let adminsId=this.props.group.data.admins;
    let admins=[];
    adminsId.map(id=>{
      dbo.getUserData(id).then(doc=>{
        admins.push({id:id,data:doc.data()});
        this.setState({admins:admins})
      })
    })
  }
  getOrganizers(){
    let orgaId=this.props.group.data.organizers;
    let orga=[];
    if(orgaId!==undefined){
      orgaId.map(id=>{
        dbo.getUserData(id).then(doc=>{
          admins.push({id:id,data:doc.data()});
          this.setState({organizers:orga})
        })
      })
    }
  }
  getMembers(){
    let membersIds = this.props.group.data.members;
    let members = [];
    if(membersIds!==undefined){
      membersIds.map(id=>{
        dbo.getUserData(id).then(doc=>{
          members.push({id:id,data:doc.data()});
          this.setState({members:members})
        });
      })
    }
  }
  test_snapshot(){
    const doc = db.collection('groups').doc(this.props.group.id);
    const observer = doc.onSnapshot(docSnapshot=>{
      this.update(docSnapshot.data());
    })
  }
  update=(data)=>{
    //mettre à jour l'affichage
    this.props.selectGroup({data:data,id:this.props.group.id});
  }
  addUser=(email)=>{
    if(email!=="" && email!==undefined){
      dbo.getUserWithEmail(email).then(doc=>{
        if(doc.empty){
          console.log('Aucun utilisateur inscrit avec cet email!');
        }else{
          doc.forEach(user=>{
            dbo.addInvitationToUser(user.id,this.props.group.id,user.data()).then(_=>{
              this.handleAdding();
            })
          })
        }
      })
    }
  }
  componentDidMount(){
    this.getAdmins();
    this.getOrganizers();
    this.getMembers();
    this.test_snapshot();
  }
  render(){
    return(
      <GroupDetails
        group={this.props.group}
        admins={this.state.admins}
        organizers={this.state.organizers}
        members={this.state.members}
        addUser={this.addUser}
        navigation={this.props.navigation}
      />
    )
  }
}
const mapStateToProps = state => ({
  group: state.group,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectGroup,
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(GroupDetailsScreen);
