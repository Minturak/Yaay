import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { connect } from 'react-redux'
import { selectGroup } from '../redux/actions/selectGroup';
import { bindActionCreators } from 'redux';

class GroupCard extends Component{
  constructor(props){
    super(props)
    this.state={
      members:[]
    }
  }
  groupSelected(group){
    this.props.selectGroup(group);
    this.props.navigation.navigate('GroupDetails');
  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.groupSelected(this.props.groupData)}>
          <Text style={styles.title}>{this.props.groupData.data.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop:hp('2%'),
    marginLeft:wp('3%'),
    marginRight:wp('3%'),
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:16,
    padding:hp('2%'),
  },
  title:{
    fontSize:18
  },
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      selectGroup
    },
    dispatch,
)
export default connect(null,mapDispatchToProps)(GroupCard);
