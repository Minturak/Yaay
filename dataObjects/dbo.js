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
}
const dbo = new Dbo();
export {dbo};
