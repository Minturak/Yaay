import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import DispositionForm from '../components/disposition-form';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class Disposition extends Component{
  render(){
    return(
      <DispositionForm
        groups={this.props.groups}
      />
    )
  }
}
const mapStateToProps = state => ({
  groups: state.groups,
});
export default connect(mapStateToProps)(Disposition);
