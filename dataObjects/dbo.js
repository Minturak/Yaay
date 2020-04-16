import React, { Component } from 'react';

import firebase from "firebase";
import {db} from '../firebase';

class Dbo{
  constructor(){
  }
  async handleLogin(email,password){
    return firebase.auth().signInWithEmailAndPassword(email,password)
  }
  async handleSignUp(email,password){
    return firebase.auth().createUserWithEmailAndPassword(email,password)
  }
  createUserDocument(uid,name,email){
    db.collection('users').doc(uid).set({pseudo:name,email:email});
  }
  async getUserData(uid){
    return db.collection('users').doc(uid).get();
  }
  async getUserWithEmail(email){
    return db.collection('users').where("email","==",email).get();
  }
  async getGroupData(id){
    return db.collection('groups').doc(id).get();
  }
  async getCategories(){
    return db.collection('constants').doc('categories').get();
  }
  async createGroup(name,description,category,admin){
    return db.collection('groups').add({name:name,description:description,category:category,admins:[admin]})
  }
  async addGroupToUser(uid,doc,groupId){
    // let groupsOfUser = [];
    let groupsOfUser = doc.data().groups || [];
    //si il n'a aucun groupe, on crée le tableau groups dans le user
    if(groupsOfUser===[]){
      db.collection('users').doc(uid).update({
        groups:[groupId]
      })
    }else{
      //si il a déjà un ou + groupe on update le tableau
      groupsOfUser.push(groupId);
      db.collection('users').doc(uid).update({
        groups:groupsOfUser
      })
    }
  }
  async editGroup(name,description,category,id){
    db.collection('groups').doc(id).update({name:name,description:description,category:category})
  }
  async addInvitationToUser(userId,groupId,data){
    let invitations = data.invitations || [];
    if(!invitations.includes(groupId)){
      invitations.push(groupId);
      db.collection('users').doc(userId).update({
        invitations:invitations
      })
    }
  }
  async removeInvitation(userId,groupId){
    let invitations=[];
    db.collection('users').doc(userId).get().then(doc=>{
      invitations=doc.data().invitations;
    })
    let index = invitations.indexOf(groupId);
    if(index > -1){ invitations.splice(index,1); }
    db.collection('users').doc(userId).update({invitations:invitations});
  }
  async addMemberToGroup(idUser,idGroup){
    let members = [];
    let events = [];
    db.collection('groups').doc(idGroup).get().then(doc=>{
      members = doc.data().members;
      events = doc.data().events;
      members.push(idUser);
    }).then(_=>{
      db.collection('groups').doc(idGroup).update({members:members})
      events.map(eventId=>{
        this.addUserToEvent(eventId,idUser);
      })
    })
  }
  async addUserToEvent(eventId,uid){
    let users = [];
    db.collection('events').doc(eventId).get().then(doc=>{
      users = doc.data().users;
      users.push(uid);
    }).then(_=>{
      db.collection('events').doc(eventId).update({users:users})
    })
  }
  async createEvent(data){
    let result = null
    let users=[]
    let event = {
      name:data.name,
      desc:data.desc,
      group:data.group,
      date:new Date(data.date),
      startTime:new Date(data.startTime),
      endTime:new Date(data.endTime),
      allDay:data.allDay,
      minUser:data.minUser,
      maxUser:data.maxUser,
      allowComments:data.allowComments,
      presents:[],
      absents:[],
      maybe:[],
    }
    this.getGroupData(data.group).then(doc=>{
      users.push(...doc.data().admins||[]);
      users.push(...doc.data().members||[]);
      users.push(...doc.data().organizers||[]);
      event.users=users
    }).then(_=>{
      result = db.collection('events').add(event).then(docRef=>{
        this.addEventToGroup(docRef.id,data.group)
      })
    })
  }
  async addEventToGroup(eventId,groupId){
    let events=[]
    db.collection('groups').doc(groupId).get().then(doc=>{
      events = doc.data().events;
    }).then(_=>{
      if(events!==undefined){
        events.push(eventId);
      }else{
        events=[eventId]
      }
    }).then(_=>{
      db.collection('groups').doc(groupId).update({events:events})
    })
  }
  async getEventData(id){
    return db.collection('events').doc(id).get();
  }
  async setUserDisponibilityForEvent(uid,eventId,dispo){
    db.collection('events').doc(eventId).get().then(doc=>{
      let inUsers = doc.data().users.includes(uid)||false;
      let inPresents = doc.data().presents.includes(uid)||false;
      let inAbsents = doc.data().absents.includes(uid)||false;
      let inMayBe = doc.data().maybe.includes(uid)||false;
      if(inUsers){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'users');
      }else if(inPresents){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'presents');
      }else if(inAbsents){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'absents');
      }else if(inMayBe){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'maybe');
      }
    })
  }
  updateDisponibilitiesForEvent(uid,eventId,doc,dispo,inCollection){
    let inColl = doc.data()[inCollection];
    let index = inColl.indexOf(uid);
    inColl.splice(index,1);
    let updateCol = doc.data()[dispo];
    if(!updateCol.includes(uid)){
      if(dispo==="presents" && updateCol.length<doc.data().maxUser){
          updateCol.push(uid);
      }else if(dispo!=="presents"){
          updateCol.push(uid);
      }
    }
    db.collection('events').doc(eventId).update({[inCollection]:inColl,[dispo]:updateCol});
  }
}

const dbo = new Dbo();
export {dbo};
