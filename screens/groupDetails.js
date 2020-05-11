import React, { Component } from 'react';

import { connect } from 'react-redux'
import { selectGroup } from '../redux/actions/selectGroup'
import { bindActionCreators } from 'redux';
import { Alert } from "react-native";
import GroupDetails from "../components/group-details";

import { dbo } from '../api/dbo';
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
  componentDidMount(){
    this.groupSnapshot()
  }
  groupSnapshot(){
    db.collection('groups').doc(this.props.group.id).onSnapshot(docSnapshot=>{
      this.update(docSnapshot.data());
    })
  }
  update=(data)=>{
    this.props.selectGroup({data:data,id:this.props.group.id});
    this.getAdmins()
    this.getOrganizers()
    this.getMembers()
    this.userAsAdminPrivilege()
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
    let organizers=[];
    if(orgaId!==undefined && orgaId.length>0){
      orgaId.map(id=>{
        dbo.getUserData(id).then(doc=>{
          organizers.push({id:id,data:doc.data()});
          this.setState({organizers:organizers})
        })
      })
    }else{
      this.setState({organizers:[]})
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
  userAsAdminPrivilege=_=>{
    dbo.userAsAdminPrivilege(this.props.group.id,this.props.user.user.uid).then(res=>{
      this.setState({isAdmin:res})
    })
  }
  addUser=(email)=>{
    if(email!=="" && email!==undefined){
      dbo.getUserWithEmail(email).then(doc=>{
        if(doc.empty){
          Alert.alert(
            "Erreur",
            "Aucun utilisateur inscrit avec cet email!",
            [
              { text: "Ok"},
            ],
            { cancelable: true }
          );
        }else{
          doc.forEach(user=>{
            console.log(this.props.group.id);
            dbo.addInvitationToUser(user.id,this.props.group.id)
            Alert.alert(
              "Succès",
              "Une invitation a été envoyée !",
              [
                { text: "Ok"},
              ],
              { cancelable: true }
            );
          })
        }
      })
    }
  }
  setUserRole=(uid,newRole)=>{
    dbo.setUserRole(this.props.group.id,uid,newRole)
  }
  removeUser=(uid,userName)=>{
    Alert.alert(
      "Suppression",
      "Êtes-vous sûr de vouloir retirer "+userName+" de ce groupe ?",
      [
        { text: "Annuler"},
        { text: "Oui", onPress: () => dbo.removeUser(this.props.group.id,uid)}
      ],
      { cancelable: true }
    );
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
        isAdmin={this.state.isAdmin}
        setUserRole={this.setUserRole}
        removeUser={this.removeUser}
      />
    )
  }
}
const mapStateToProps = state => ({
  group: state.group,
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectGroup,
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(GroupDetailsScreen);
