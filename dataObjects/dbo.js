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
  createUserDocument(uid,name){
    db.collection('users').doc(uid).set({pseudo:name});
  }
  async getUserData(uid){
    return db.collection('users').doc(uid).get();
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
    let groupsOfUser = [];
    groupsOfUser = doc.data().groups;
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

}
const dbo = new Dbo();
export {dbo};
