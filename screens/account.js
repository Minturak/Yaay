import React, { Component } from 'react';
import AccountDetails from '../components/account-details'
import { connect } from 'react-redux'
import { connectUser}  from '../redux/actions/connect';
import { bindActionCreators } from 'redux';

import {dbo} from '../api/dbo';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:'',
      validated:false
    };
  }
  componentDidMount=_=>{
    dbo.getUserData(this.props.user.user.uid).then(doc=>{
      this.setState({user:doc.data()})
    })
    this.setState({validated:dbo.verifiedEmail()})
  }
  disconnect=_=>{
    this.props.connectUser(undefined);
    this.props.navigation.replace('Login')
  }
  resendEmail=_=>{
    dbo.sendEmailVerification()
  }
  render() {
    if(this.state.user===undefined){
      return null
    }
    return (
      <AccountDetails 
        user={this.state.user}
        validated={this.state.validated}
        disconnect={this.disconnect}
        resendEmail={this.resendEmail}
      />
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    connectUser
  },
  dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(Account);
