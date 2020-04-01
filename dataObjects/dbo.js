import React, { Component } from 'react';

import firebase from "firebase";
import {db} from '../firebase';

class Dbo{
  constructor(){
  }
  fetchData(){

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
    db.collection('groups').doc(idGroup).get().then(doc=>{
      members = doc.data().members;
    })
    members.push(idUser);
    db.collection('groups').doc(idGroup).update({members:members})
  }
}
const dbo = new Dbo();
export {dbo};
