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
  //User related
  async getUserData(uid){
    return db.collection('users').doc(uid).get();
  }
  createUserDocument(uid,name,email){
    db.collection('users').doc(uid).set({pseudo:name,email:email});
  }
  async getUserWithEmail(email){
    return db.collection('users').where("email","==",email).get();
  }
  async addGroupToUser(uid,doc,groupId){
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
  async addInvitationToUser(userId,groupId,data){
    let groups = []
    db.collection('users').doc(userId).get().then(doc=>{
      groups = doc.data().groups || [];
      if(!groups.includes(groupId)){
        let invitations = data.invitations || [];
        if(!invitations.includes(groupId)){
          invitations.push(groupId);
          db.collection('users').doc(userId).update({
            invitations:invitations
          })
        }
      }
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
    this.removeGroupFromUser(grpId,uid)
    this.removeUserFromEvents(grpId,uid);
    this.removeUserFromDispos(grpId,uid);
    this.removeUserFromGroup(grpId,uid);
  }
  removeGroupFromUser(grpId,uid){
    db.collection('users').doc(uid).get().then(doc=>{
      let groups = doc.data().groups
      let index = groups.indexOf(grpId)
      groups.splice(index,1)
      db.collection('users').doc(uid).update({groups:groups})
    })
  }
  removeUserFromGroup(grpId,uid){
    console.log('remove from group');
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
    console.log('remove from event');
    
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
    console.log('remove from dispos');
    
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

  //Event related
  createEvent(data){
    //for some unknown reasons if frequency is 0 and reccurent is false the getGroupData crashes
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
  deleteOneEvent(eventId){
    db.collection('events').doc(eventId).update({users:[]}).then(_=>{
      let i = 0
      while(i<100000000){i++}
      db.collection('events').doc(eventId).delete()
    })
  }
  deleteMutipleEvents(link){
    db.collection('events').where('link','==',link).get().then(events=>{
      events.forEach(event=>{
        db.collection('events').doc(event.id).delete();
        let i = 0
        while(i<100000000){i++}
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
  async addDispo(name,desc,groupId,dates){
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
      }).then(docRef=>{
        this.addDispoToGroup(groupId,docRef.id)
      })
    })
  }
  async addDispoToGroup(groupId,dispoId){
    let dispos = [];
    this.getGroupData(groupId).then(doc=>{
      dispos=doc.data().dispos;
    }).then(_=>{
      if(dispos!==undefined){
        dispos.push(dispoId)
      }else{
        dispos=[dispoId]
      }
    }).then(_=>{
      db.collection('groups').doc(groupId).update({dispos:dispos})
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
  //Others
  async getCategories(){
    return db.collection('constants').doc('categories').get();
  }
}

const dbo = new Dbo();
export {dbo};
