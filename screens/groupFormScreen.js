import React, { Component } from 'react';
import GroupForm from "../components/group-form"

import { connect } from 'react-redux'
import {setCategories} from '../redux/actions/setCategories'
import { bindActionCreators } from 'redux';

import firebase from "firebase";
import {dbo} from '../api/dbo';

class GroupFormScreen extends Component{
  componentDidMount=_=>{
    this.fetchCategories()
  }
  fetchCategories=_=>{
    let categories = []
    dbo.getCategories().then(doc=>{
      doc.data().labels.map(label=>{
        categories.push(label)
      })
      this.props.setCategories(categories)
    })
  }
  handleSubmit=(name,desc,cat)=>{
    var idUser = firebase.auth().currentUser.uid;
    dbo.createGroup(name,desc,cat,idUser)
    this.props.navigation.navigate('ListGroups');
  }
  render(){
    if(this.props.categories===undefined){
      return null
    }
    return(
      <GroupForm handleSubmit={this.handleSubmit} categories={this.props.categories}/>
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setCategories
  },
  dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(GroupFormScreen);
