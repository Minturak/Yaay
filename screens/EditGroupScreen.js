import React, { Component } from 'react';
import EditGroup from "../components/edit-group"

import { connect } from 'react-redux'
import {setCategories} from '../redux/actions/setCategories';
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';

class EditGroupScreen extends Component{
  componentDidMount=_=>{
    this.fetchCategories()
  }
  handleEdit=(name,desc,cat,id)=>{
    dbo.editGroup(name,desc,cat,id)
    this.props.navigation.navigate('GroupDetails')
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
  render(){
    if(this.props.categories===undefined){
      return null
    }
    return(
      <EditGroup 
        handleEdit={this.handleEdit} 
        group={this.props.group} 
        categories={this.props.categories}
      />
    )
  }
}
const mapStateToProps = state => ({
  categories: state.categories,
  group: state.group,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setCategories
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(EditGroupScreen);
