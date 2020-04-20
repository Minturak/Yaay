import React, { Component } from 'react';
import { connect } from 'react-redux'
import DispositionDetails from "../components/disposition-details"

class DispositionDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DispositionDetails dispo={this.props.dispo} user={this.props.user}/>
    );
  }
}
const mapStateToProps = state => ({
  dispo:state.dispo,
  user:state.user
});
export default connect (mapStateToProps)(DispositionDetailsScreen);
