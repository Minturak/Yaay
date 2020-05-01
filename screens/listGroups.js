import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import GroupCard from '../components/group-card'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { connect } from 'react-redux'
import { setGroups } from '../redux/actions/setGroups';
import { bindActionCreators } from 'redux';

import {db} from '../firebase';

class ListGroups extends Component{
  constructor(props){
    super(props)
    this.state={
      groups:[]
    }
  }
  componentDidMount(){
    if(this.props.user===undefined){
      this.props.navigation.navigate('Home')
    }else{
      var uid = this.props.user.user.uid;
      this.listenerGroups(uid);
    }
  }
  listenerGroups(uid){
    db.collection('groups').where("users","array-contains",uid).onSnapshot(doc=>{
      let groups=[];
      doc.forEach(group=>{
        groups.push({id:group.id,data:group.data()})
      })
      this.setState({groups:groups})
    })
  }
  render(){
    return(
      <View>
        <TouchableOpacity onPress={this.handleLogin}>
          <View style={styles.button}>
            <Text style={{color:'#ffffff'}}>Créer un groupe</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => <GroupCard groupData={item} navigation={this.props.navigation}/>}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  button:{
    backgroundColor: '#249E6B',
    alignItems: 'center',
    padding: 10,
    marginTop: hp('2%'),
    marginLeft: wp('9%'),
    marginRight: wp('9%'),
  }
});
const mapStateToProps = state => ({
  groups: state.groups,
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setGroups
    },
    dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(ListGroups);
