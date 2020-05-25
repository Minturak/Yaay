/**
 * Gère la logique pour afficher les boutons de la page d'accueil
 * Gère la logique pour afficher les cartes des événements
 * Gère la logique pour indiquer sa présence à un événement depuis la carte de celui-ci
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import EventCard from "../components/event-card";
import { Alert } from "react-native";
import { connect } from 'react-redux'
import { setInvitations } from '../redux/actions/setInvitations';
import { setGroups } from '../redux/actions/setGroups'
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';
import {db} from '../firebase';

class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      invitations:[],
      events:[],
      dispos:[],
      showButtons:false,
    }
  }
  componentDidMount(){
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }else{
      let uid = this.props.user.user.uid;
      this.listenerInvites(uid);
      this.listenerEvents(uid);
      this.listenerGroups(uid)
      this.listenerDispos(uid)
      //remind the user of validating his email address
      if(!dbo.verifiedEmail()){
        Alert.alert(
          "Adresse email non validée",
          "Cliquez sur le lien qui vous a été envoyé au moment de votre inscription",
          [
            {text: "Ok"},
            {text:"Renvoyer le lien", onPress:()=>{dbo.sendEmailVerification()}}
          ],
          { cancelable: false }
        );
      }
    }
  }
  listenerInvites(uid){
    db.collection('users').doc(uid).onSnapshot(doc=>{
      let invites = []
      if(doc.data().invitations!==undefined){
        invites = doc.data().invitations;
      }
    this.setState({invitations:invites});
    this.props.setInvitations(invites);
    });
  }
  listenerEvents(uid){
    db.collection('events').where("users","array-contains",uid).onSnapshot(doc=>{
      let events = [];
      doc.forEach(event=>{
        events.push({id:event.id,...event.data()})
      })
      events.sort(this.orderByDate);
      this.setState({events:events})
    })
  }
  listenerGroups(uid){
    db.collection('groups').where("users","array-contains",uid).onSnapshot(doc=>{
      let groups=[];
      doc.forEach(group=>{
        groups.push({id:group.id,data:group.data()})
      })
      this.props.setGroups(groups);
      this.showCreateButtons(uid);
    })
  }
  listenerDispos(uid){
    db.collection('dispos').where("members","array-contains",uid).onSnapshot(doc=>{
      let dispos = [];
      doc.forEach(dispo=>{
        dispos.push({id:dispo.id,...dispo.data()})
      })
      this.setState({dispos:dispos})
    })
  }
  orderByDate=(a,b)=>{
    if ( a.date.seconds < b.date.seconds ){
      return -1;
    }
    if ( a.date.seconds > b.date.seconds ){
      return 1;
    }
    return 0;
  }
  //affiche ou cache les boutons pour la création des disposition et des événement
  //selon si l'utilisateut est un administrateur ou un organisateur de l'un des ses groupes
  showCreateButtons=(uid)=>{
    if(this.props.groups!==undefined){
      this.props.groups.map(group=>{
        if(group.data.admins.includes(uid)||group.data.organizers.includes(uid)){
          this.setState({showButtons:true})
        }
      })
    }
  }
  isPresent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'presents');
  }
  isAbsent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'absents');
  }
  mayBePresent=(uid,eventId)=>{
    dbo.setUserDisponibilityForEvent(uid,eventId,'maybe');
  }
  render(){
    if(this.props.user===undefined || this.props.groups===undefined){
      return null
    }
    return(
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          {this.props.groups.length>0 && 
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Disposition')}>
              <View style={styles.button}>
                <Text style={styles.whiteText}>Indiquer mes dispositions</Text>
              </View>
            </TouchableOpacity>
          }
          {this.props.groups.length<1 && 
            <View style={styles.welcomeText}>
              <Text>Créez un groupe ou demandez à un administrateur de vous inviter dans un groupe pour commencer à utiliser l'application</Text>
            </View>
          }
          {this.state.showButtons &&
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('CreateEvent')}>
                <View style={styles.button}>
                  <Text style={styles.whiteText}>Créer un événement</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
          {this.state.invitations.length>0 &&
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Invitations')}>
              <View style={styles.button}>
                <Text style={styles.whiteText}>Nouvelles invitations !</Text>
              </View>
            </TouchableOpacity>
          }
          {this.state.dispos.length>0 &&
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Dispositions')}>
              <View style={styles.button}>
                <Text style={styles.whiteText}>Nouvelles dispositions</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.events}
            renderItem={({item})=>
            <EventCard data={item}
              navigation={this.props.navigation}
              isPresent={this.isPresent}
              isAbsent={this.isAbsent}
              mayBePresent={this.mayBePresent}
            />}
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    alignItems:'center',
  },
  welcomeText:{
    paddingHorizontal:wp('2%'),
    paddingVertical:hp('2%'),
  },
  whiteText:{
    color:'#ffffff'
  },
  listContainer:{
    marginBottom:hp('27%'),
  },
  button: {
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: wp('2%'),
    marginTop: hp('2%'),
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
  },
  buttonsContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center'
  },
});
const mapStateToProps = state => ({
  user: state.user,
  groups: state.groups,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setInvitations,
      setGroups
    },
    dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(Home);
