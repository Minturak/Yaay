import React, { Component } from 'react';
import { connect } from 'react-redux'
import DispositionDetails from "../components/disposition-details"
import { dbo } from '../api/dbo';

class DispositionDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }
  changeDispo=(dateId)=>{
    let dispoId = this.props.dispo.id;
    let uid = this.props.user.user.uid;
    dbo.changeDispo(uid,dateId,dispoId);
  }
  render() {
    return (
      <DispositionDetails 
        dispo={this.props.dispo} 
        user={this.props.user}
        changeDispo={this.changeDispo}
      />
    );
  }
}
const mapStateToProps = state => ({
  dispo:state.dispo,
  user:state.user
});
export default connect (mapStateToProps)(DispositionDetailsScreen);
