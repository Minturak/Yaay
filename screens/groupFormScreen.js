/**
 * Gère la logique pour la création d'un groupe
 */
import React, { Component } from 'react';
import GroupForm from "../components/group-form"

import { connect } from 'react-redux'
import {setCategories} from '../redux/actions/setCategories'
import { bindActionCreators } from 'redux';

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
    dbo.createGroup(name,desc,cat,this.props.user.user.uid)
    this.props.navigation.pop()
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
  categories: state.categories,
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setCategories
  },
  dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(GroupFormScreen);
