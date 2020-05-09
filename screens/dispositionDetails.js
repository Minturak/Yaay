import React, { Component } from 'react';
import DispositionDetails from "../components/disposition-details"
import { Alert } from "react-native";
import { connect } from 'react-redux'
import { eventFrom } from '../redux/actions/eventFrom';
import { selectDispo } from '../redux/actions/selectDispo';
import { bindActionCreators } from 'redux';

import { dbo } from '../api/dbo';
import { db } from '../firebase';

class DispositionDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      members:[],
      userDispos:[],
      canUpdate:false,
      canTransform:false,
    }
  }
  componentDidMount=_=>{
    this.dispoListener()
    this.getMembers()
    this.getMembersDispos()
    this.canUpdate()
    this.canTransform()
  }
  dispoListener=_=>{
    db.collection('dispos').doc(this.props.dispo.id).onSnapshot(doc=>{
      this.props.selectDispo({id:this.props.dispo.id,...doc.data()})
    })
  }
  getMembers=_=>{
    let members=[];
    this.props.dispo.members.map(uid=>{
      dbo.getUserData(uid).then(doc=>{
        members.push({id:uid,pseudo:doc.data().pseudo})
      }).then(_=>{
        this.setState({members:members})
      })
    })
  }
  getMembersDispos=_=>{
    let userDispos = [];
    this.props.dispo.dates.map(date=>{
      if(date.available.includes(this.props.user.user.uid)){
        userDispos.push(true)
      }else{
        userDispos.push(false)
      }
    })
    this.setState({userDispos:userDispos})
  }
  changeDispo=(dates)=>{
    let uid = this.props.user.user.uid
    let dispoId = this.props.dispo.id
    dbo.setDispos(uid,dispoId,dates)
    this.setState({userDispos:dates})
  }
  canUpdate=_=>{
    let isOrganizer = false;
    let isCreator = false;
    dbo.userAsOrganizersPrivilege(this.props.dispo.group,this.props.user.user.uid).then(res=>{
      isOrganizer = res
    }).then(_=>{
      isCreator = this.props.user.user.uid === this.props.dispo.creator
      let canUpdate = isOrganizer||isCreator
      this.setState({canUpdate:canUpdate})
    })
  }
  canTransform=_=>{
    dbo.userAsOrganizersPrivilege(this.props.dispo.group,this.props.user.user.uid).then(res=>{
      this.setState({canTransform:res})
    })
  }
  delete=_=>{
    Alert.alert(
      "Suppression",
      "Êtes-vous sûr de vouloir supprimer cette disponibilité ?",
      [
        {text: "Non"},
        {text:"Oui", onPress:()=>{
            this.props.navigation.pop()
            this.props.navigation.navigate('Home')
            dbo.deleteDispo(this.props.dispo.id)
          }
        }
      ],
      { cancelable: false }
    );
  }
  toEdit=_=>{
    this.props.navigation.navigate('DispositionEditScreen')
  }
  //redirect to tje create event screen with the dispo in redux
  //so the screen is pre-filled
  createEvent=_=>{
    this.props.eventFrom(this.props.dispo)
    this.props.navigation.navigate('CreateEvent')
  }
  render() {
    if(this.state.userDispos.length>0 && this.state.members.length>0){
      return (
        <DispositionDetails 
          dispo={this.props.dispo} 
          user={this.props.user}
          changeDispo={this.changeDispo}
          createEvent={this.createEvent}
          members={this.state.members}
          userDispos={this.state.userDispos}
          canUpdate={this.state.canUpdate}
          canTransform={this.state.canTransform}
          delete={this.delete}
          toEdit={this.toEdit}
        />
      );
    }else{
      return null
    }
  }
}
const mapStateToProps = state => ({
  dispo:state.dispo,
  user:state.user
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    eventFrom,
    selectDispo,
  },
  dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(DispositionDetailsScreen);
