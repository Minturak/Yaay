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
      user:''
    };
  }
  componentDidMount=_=>{
    dbo.getUserData(this.props.user.user.uid).then(doc=>{
      this.setState({user:doc.data()})
    })
  }
  disconnect=_=>{
    this.props.connectUser(undefined);
    this.props.navigation.replace('Login')
  }
  render() {
    if(this.state.user.length==0){
      return null
    }
    return (
      <AccountDetails 
        user={this.state.user}
        disconnect={this.disconnect}
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
