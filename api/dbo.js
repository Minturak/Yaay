/**
 * Fichier qui regroupe toutes les fonctions pour lire, écrire, modifier, supprimer dans la base de données
 */
import moment from "moment";
import firebase from "firebase";
import {db} from '../firebase';

class Dbo{
  constructor(){
  }
  //Login related
  async handleLogin(email,password){
    return firebase.auth().signInWithEmailAndPassword(email,password)
  }
  async handleSignUp(email,password){
    return firebase.auth().createUserWithEmailAndPassword(email,password)
  }
  forgottenPassword(email){
    return firebase.auth().sendPasswordResetEmail(email)
  }
  sendEmailVerification(){
    let newUser = firebase.auth().currentUser;
    newUser.sendEmailVerification()
  }
  verifiedEmail(){
    let user = firebase.auth().currentUser;
    user.reload()
    return user.emailVerified;
  }
  //User related
  //
  async getUserData(uid){
    return db.collection('users').doc(uid).get();
  }
  createUserDocument(uid,name,email){
    db.collection('users').doc(uid).set({pseudo:name,email:email});
  }
  async getUserWithEmail(email){
    return db.collection('users').where("email","==",email).get();
  }
  async userAsOrganizersPrivilege(grpId,uid){
    let res = false;
    return dbo.getGroupData(grpId).then(doc=>{
      if(doc.data().admins.includes(uid) || doc.data().organizers.includes(uid)){
        res = true
      }
    }).then(_=>{
      return res
    })
  }
  async userAsAdminPrivilege(grpId,uid){
    let res = false;
    return dbo.getGroupData(grpId).then(doc=>{
      if(doc.data().admins.includes(uid)){
        res = true
      }
    }).then(_=>{
      return res
    })
  }
  //Invitation related
  async addInvitationToUser(userId,groupId){
    this.getGroupData(groupId).then(groupDoc=>{
      this.getUserData(userId).then(doc=>{
        users = groupDoc.data().users
        if(!users.includes(userId)){
          let invitations = doc.data().invitations || [];
          if(!invitations.includes(groupId)){
            invitations.push(groupId);
            db.collection('users').doc(userId).update({
              invitations:invitations
            })
            this.emailInvitation(groupId,userId)
          }
        }
      })
    })
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
    let users = [];
    db.collection('groups').doc(idGroup).get().then(doc=>{
      members = doc.data().members;
      users = doc.data().users;
      members.push(idUser);
      users.push(idUser);
    }).then(_=>{
      db.collection('groups').doc(idGroup).update({members:members,users:users})
      this.addUserToDispos(idGroup,idUser);
      this.addUserToEvents(idGroup,idUser);
    })
  }
  async addUserToEvents(grpId,uid){
    db.collection('events').where('group','==',grpId).get().then(doc=>{
      doc.forEach(event=>{
        let users = event.data().users;
        users.push(uid)
        db.collection('events').doc(event.id).update({users:users})
      })
    })
  }
  async addUserToDispos(grpId,uid){
    db.collection('dispos').where('group','==',grpId).get().then(doc=>{
      doc.forEach(dispo=>{
        let members = dispo.data().members;
        members.push(uid)
        db.collection('dispos').doc(dispo.id).update({members:members})
      })
    })
  }
  //Group related
  async getGroupData(id){
    return db.collection('groups').doc(id).get();
  }
  async createGroup(name,description,category,admin){
    return db.collection('groups').add({
      name:name,
      description:description,
      category:category,
      admins:[admin],
      users:[admin],
      members:[],
      organizers:[],
      events:[],
      dispos:[]
    })
  }
  async editGroup(name,description,category,id){
    db.collection('groups').doc(id).update({name:name,description:description,category:category})
  }
  async setUserRole(grpId,uid,newRole){
    this.getGroupData(grpId).then(doc=>{
      let isAdmin = doc.data().admins.includes(uid);
      let isOrganizer = doc.data().organizers.includes(uid);
      let isMember = doc.data().members.includes(uid);
      if(isAdmin){
        this.changeUserRole(grpId,doc,uid,newRole,'admins')
      }else if(isOrganizer){
        this.changeUserRole(grpId,doc,uid,newRole,'organizers')
      }else if(isMember){
        this.changeUserRole(grpId,doc,uid,newRole,'members')
      }
    })
  }
  async changeUserRole(grpId,doc,uid,newRole,oldRole){
    let oldColl = doc.data()[oldRole]
    let newColl = doc.data()[newRole]
    let index = oldColl.indexOf(uid)
    oldColl.splice(index,1)
    newColl.push(uid)
    db.collection('groups').doc(grpId).update({[oldRole]:oldColl,[newRole]:newColl})
  }
  async removeUser(grpId,uid){
    this.removeUserFromEvents(grpId,uid);
    this.removeUserFromDispos(grpId,uid);
    this.removeUserFromGroup(grpId,uid);
  }
  removeUserFromGroup(grpId,uid){
    db.collection('groups').doc(grpId).get().then(doc=>{
      let users = doc.data().users;
      let index = users.indexOf(uid);
      users.splice(index,1)
      if(doc.data().admins.includes(uid)){
        let admins = doc.data().admins
        index = admins.indexOf(uid)
        admins.splice(index,1)
        db.collection('groups').doc(grpId).update({admins:admins,users:users})
      }else if(doc.data().organizers.includes(uid)){
        let organizers = doc.data().organizers
        index = organizers.indexOf(uid)
        organizers.splice(index,1)
        db.collection('groups').doc(grpId).update({organizers:organizers,users:users})
      }else if(doc.data().members.includes(uid)){
        let members = doc.data().members
        index = members.indexOf(uid)
        members.splice(index,1)
        db.collection('groups').doc(grpId).update({members:members,users:users})
      }
    })
  }
  removeUserFromEvents(grpId,uid){
    db.collection('events').where('group','==',grpId).get().then(docs=>{
      docs.forEach(doc=>{
        let users = doc.data().users
        let index = users.indexOf(uid)
        users.splice(index,1)
        if(doc.data().presents.includes(uid)){
          let presents = doc.data().presents
          index = presents.indexOf(uid)
          presents.splice(index,1)
          db.collection('events').doc(doc.id).update({users:users,presents:presents})
        }else if(doc.data().maybe.includes(uid)){
          let maybe = doc.data().maybe
          index = maybe.indexOf(uid)
          maybe.splice(index,1)
          db.collection('events').doc(doc.id).update({users:users,maybe:maybe})
        }else if(doc.data().noresponse.includes(uid)){
          let noresponse = doc.data().noresponse
          index = noresponse.indexOf(uid)
          noresponse.splice(index,1)
          db.collection('events').doc(doc.id).update({users:users,noresponse:noresponse})
        }else if(doc.data().absents.includes(uid)){
          let absents = doc.data().absents
          index = absents.indexOf(uid)
          absents.splice(index,1)
          db.collection('events').doc(doc.id).update({users:users,absents:absents})
        }else{
          db.collection('events').doc(doc.id).update({users:users})
        }
      })
    })
  }
  removeUserFromDispos(grpId,uid){
    db.collection('dispos').where('group','==',grpId).get().then(docs=>{
      docs.forEach(doc=>{
        let members = doc.data().members
        let index = members.indexOf(uid)
        members.splice(index,1)
        let dates = doc.data().dates
        dates.forEach((date,id)=>{
          if(date.available.includes(uid)){
            let available = date.available
            index = available.indexOf(uid)
            available.splice(index,1)
            date.available=available
          }
        })
        db.collection('dispos').doc(doc.id).update({dates:dates,members:members})
      })
    })
  }
  async deleteGroup(grpId){
    db.collection('groups').doc(grpId).update({users:[]})
    db.collection('events').where('group','==',grpId).get().then(events=>{
      events.forEach(event=>{
        db.collection('events').doc(event.id).update({users:[]}).then(_=>{
          db.collection('events').doc(event.id).delete()
        })
      })
    })
    db.collection('dispos').where('group','==',grpId).get().then(dispos=>{
      dispos.forEach(dispo=>{
        db.collection('dispos').doc(dispo.id).update({members:[]}).then(_=>{
          db.collection('dispos').doc(dispo.id).delete()
        })
      })
    })
  }
  //Event related
  createEvent(data){
    data.frequency = data.frequency || 1;
    if(!data.reccurent){data.until = data.date}
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
      presents:data.presents||[],
      absents:[],
      maybe:[],
      noresponse:[],
      link:new Date(data.date).getTime(),
      until:new Date(data.until),
    }
    this.getGroupData(event.group).then(doc=>{
      users.push(...doc.data().admins||[]);
      users.push(...doc.data().members||[]);
      users.push(...doc.data().organizers||[]);
      event.users=users
      event.noresponse=users
    }).then(_=>{
      while(moment(event.date).isSameOrBefore(moment(event.until),'day,')){
        db.collection('events').add(event)
        let newDate = new Date(event.date)
        newDate.setDate(newDate.getDate()+ parseInt(data.frequency))
        event.date = newDate
      }
      if(data.reccurent){
        this.emailNewRecurrentEvent(data.group,data.date,data.name,data.frequency)
      }else{
        this.emailNewEvent(data.group,data.date,data.name)
      }
    })
  }
  async getEventData(id){
    return db.collection('events').doc(id).get();
  }
  async setUserDisponibilityForEvent(uid,eventId,dispo){
    db.collection('events').doc(eventId).get().then(doc=>{
      let inPresents = doc.data().presents.includes(uid)||false;
      let inAbsents = doc.data().absents.includes(uid)||false;
      let inMayBe = doc.data().maybe.includes(uid)||false;
      if(inPresents){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'presents');
      }else if(inAbsents){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'absents');
      }else if(inMayBe){
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,'maybe');
      }else{
        this.updateDisponibilitiesForEvent(uid,eventId,doc,dispo,"null");
      }
    })
  }
  updateDisponibilitiesForEvent(uid,eventId,doc,dispo,inCollection){
    let noresponse = doc.data().noresponse
    let index = noresponse.indexOf(uid)
    if(index>-1){
      noresponse.splice(index,1)
    }
    if(inCollection==="null"){
      let updateCol = doc.data()[dispo]
      updateCol.push(uid)
      db.collection('events').doc(eventId).update({[dispo]:updateCol,noresponse:noresponse})
    }else{
      let inColl = doc.data()[inCollection];
      index = inColl.indexOf(uid);
      inColl.splice(index,1);
      let updateCol = doc.data()[dispo];
      if(!updateCol.includes(uid)){
        if(dispo==="presents"){
          if(updateCol.length<doc.data().maxUser && doc.data.maxUser>0){
            updateCol.push(uid);
          }else{
            updateCol.push(uid);
          }
        }else if(dispo!=="presents"){
          updateCol.push(uid);
        }
      }
      db.collection('events').doc(eventId).update({[inCollection]:inColl,[dispo]:updateCol,noresponse:noresponse});
    }
  }
  async getLinkedEvents(link){
    return db.collection('events').where('link','==',link).get()
  }
  async deleteOneEvent(eventId){
    db.collection('events').doc(eventId).update({users:[]}).then(_=>{
      db.collection('events').doc(eventId).delete()
    })
  }
  async deleteMutipleEvents(link){
    db.collection('events').where('link','==',link).get().then(events=>{
      events.forEach(event=>{
        db.collection('events').doc(event.id).delete();
      })
    });
  }
  updateOneEvent(eventId,data){
    let event={}
    db.collection('events').doc(eventId).get().then(doc=>{
      event=doc.data();
      event.name=data.name
      event.desc=data.desc
      if(!data.allEvents){
        event.date=new Date(data.date)
      }else{
        event.date=new Date(doc.data().date.seconds*1000)
      }
      event.startTime=new Date(data.startTime)
      event.endTime=new Date(data.endTime)
      event.minUser=data.minUser
      event.maxUser=data.maxUser
      event.allDay=data.allDay
    }).then(_=>{
      db.collection('events').doc(eventId).set(event)
    })
  }
  updateMultipleEvents(link,data){
    db.collection('events').where('link','==',link).get().then(events=>{
      events.forEach(event=>{
        this.getEventData(event.id).then(doc=>{
          this.updateOneEvent(event.id,data)
        })
      })
    })
  }
  //Dispo related
  async addDispo(name,desc,groupId,dates,uid){
    let members = []
    this.getGroupData(groupId).then(doc=>{
      members.push(...doc.data().admins||[]);
      members.push(...doc.data().members||[]);
      members.push(...doc.data().organizers||[]);
    }).then(_=>{
      db.collection('dispos').add({
        name:name,
        desc:desc,
        group:groupId,
        dates:dates,
        members:members,
        creator:uid
      }).then(_=>{
        this.emailNewDispo(groupId,name,uid)
      })
    })
  }
  async setDispos(uid,dispoId,dispos){
    let availables = []
    db.collection('dispos').doc(dispoId).get().then(doc=>{
      availables=doc.data().dates
      dispos.map((available,dateId)=>{
        if(available){
          if(!availables[dateId].available.includes(uid)){
            availables[dateId].available.push(uid)
          }
        }else{
          if(availables[dateId].available.includes(uid)){
            let index = availables[dateId].available.indexOf(uid)
            availables[dateId].available.splice(index,1)
          }
        }
      })
    }).then(_=>{
      db.collection('dispos').doc(dispoId).update({dates:availables})
    })
  }
  async editDispo(dispoId,name,desc){
    db.collection('dispos').doc(dispoId).update({name:name,desc:desc})
  }
  async deleteDispo(dispoId){
    db.collection('dispos').doc(dispoId).update({members:[]}).then(_=>{
      db.collection('dispos').doc(dispoId).delete()
    })
  }
  //Email related
  async emailNewEvent(grpId,date,name){
    /*
    * Subject de l'email: Nom du groupe - Nouvel évènement le date de l'évènement
    * Tu as reçu une invitation à un nouvel événement nom de l'évènement planifié le date de l'évènement . Merci d'indiquer ta présence directement depuis l'Application.
    */
    let email={
      to:undefined,
      message:{
        subject:undefined,
        text:undefined,
        html:undefined,
      }
    }
    this.getGroupData(grpId).then(doc=>{
      email.message.subject=doc.data().name+" - Nouvel évènement le "+moment(date).format('DD-MM')
      doc.data().users.map(userId=>{
        this.getUserData(userId).then(userDoc=>{
          email.to=userDoc.data().email
          email.message.text="Tu as reçu une invitation à un nouvel événement "+ name+" planifié le "+moment(date).format('DD-MM')+". Merci d'indiquer ta présence directement depuis l'Application"
          email.message.html = email.message.text
          db.collection('mail').add({...email})
        })
      })
    })
  }
  async emailNewRecurrentEvent(grpId,date,name,frequency){
    /**
     * Subject : NOM_GROUPE - Nouvel évènement récurrent
     * Text: L'événement NOM_EVENEMENT récurrent a été créé dans le groupe NOM_GROUPE
     */
    let email={
      to:undefined,
      message:{
        subject:undefined,
        text:undefined,
        html:undefined,
      }
    }
    this.getGroupData(grpId).then(doc=>{
      email.message.subject=doc.data().name+" - Nouvel évènement récurrent"
      doc.data().users.map(userId=>{
        this.getUserData(userId).then(userDoc=>{
          email.to=userDoc.data().email
          email.message.text="L'évènement récurrent "+name+" a été ajouté dans le groupe "+doc.data().name+". \n Il commence le "+moment(date).format("DD-MM")+" et se repète tous les "+frequency+" jours. \n Pensez à indiquer vos disponibilités"
          email.message.html = email.message.text
          db.collection('mail').add({...email})
        })
      })
    })
  }
  async emailNewDispo(grpId,name,author){
    //get groupe name
    //get email of members of groupe
    //build email
    //foreach members send
    let membersEmail=[]
    let membersId=[]
    let authorName=''
    let email={
      to:undefined,
      message:{
        subject:undefined,
        text:undefined,
        html:undefined,
      }
    }
    this.getGroupData(grpId).then(doc=>{
      membersId=doc.data().users;
      email.message.subject=doc.data().name+" - Nouvelles disponibilités"
      this.getUserData(author).then(doc=>{authorName=doc.data().pseudo})
    }).then(_=>{
      membersId.map(id=>{
        db.collection('users').doc(id).get().then(doc=>{
          membersEmail.push(doc.data().email);
          email.to=doc.data().email
          email.message.text=authorName + " souhaite savoir tes disponibilité pour un "+name+" durant cette semaine. Connecte toi sur l'application et indique tes disponibilités."
          email.message.html = email.message.text
          db.collection('mail').add({...email})
        })
      })
    })
  }
  async emailInvitation(grpId,uid){
    /*
    * Subject: Vous avez reçu une nouvelle invitation
    * Text: Vous avez reçu une invitation à rejoindre le groupe NOM_GROUPE. Connectez vous pour rejoindre ce groupe
    */
    let email={
      to:undefined,
      message:{
        subject:undefined,
        text:undefined,
        html:undefined,
      }
    }
    this.getGroupData(grpId).then(doc=>{
      this.getUserData(uid).then(userDoc=>{
        email.to=userDoc.data().email
        email.message.subject="Vous avez reçu une nouvelle invitation"
        email.message.text="Vous avez reçu une invitation à rejoindre le groupe : "+doc.data().name+". Connectez vous pour rejoindre ce groupe"
        email.message.html=email.message.text
        db.collection('mail').add({...email})
      })
    })
  }
  //Others
  async getCategories(){
    return db.collection('constants').doc('categories').get();
  }
}

const dbo = new Dbo();
export {dbo};
