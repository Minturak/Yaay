import React, { Component } from 'react';
import DispositionForm from '../components/disposition-form';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {dbo} from "../api/dbo"

class Disposition extends Component{
  handleSave=(data)=>{
    dbo.addDispo(data.name,data.desc,data.group,data.dates).then(_=>{
      this.props.navigation.navigate('Home');
    });
  }
  render(){
    return(
      <DispositionForm
        groups={this.props.groups}
        handleSave={this.handleSave}
      />
    )
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
});
export default connect(mapStateToProps)(Disposition);
