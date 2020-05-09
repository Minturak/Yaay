import React, { Component } from 'react';
import DispositionEdit from '../components/disposition-edit'
import { connect } from 'react-redux'
import { dbo } from '../api/dbo';

class DispositionEditScreen extends Component {
  constructor(props) {
    super(props);
  }
  handleEdit=(state)=>{
    dbo.editDispo(this.props.dispo.id,state.name,state.desc)
    this.props.navigation.pop()
  }
  render() {
    return (
      <DispositionEdit
        dispo={this.props.dispo}
        handleEdit={this.handleEdit}
      />
    );
  }
}
const mapStateToProps = state => ({
  dispo: state.dispo,
});
export default connect(mapStateToProps)(DispositionEditScreen);
