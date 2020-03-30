import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { dbo } from '../dataObjects/dbo';

class GroupDetails extends Component{
  constructor(props){
    super(props)
    this.state={
      members:[]
    }
  }
  componentDidMount(){
    var grpId = this.props.group.id;
    let membersIds = this.props.group.data.members;
    let members = [];
    membersIds.map(id=>{
      dbo.getUserData(id).then(doc=>{
        members.push({id:id,data:doc.data()});
        this.setState({members:members})
      });
    })
  }
  render(){
    //console.log(this.props.route.params);
    console.log('==============');
    console.log(this.props);
    return(
      <View style={styles.container}>
        <Button title="update" onPress={()=>this.props.navigation.navigate('GroupFormScreen')}/>
        <Text style={styles.title}>{this.props.group.data.name}</Text>
        <Text>Catégorie : {this.props.group.data.category}</Text>
        <Text>Description du groupe : {this.props.group.data.description}</Text>
        {this.state.members.map(user=>{
          return(
              <Text>{user.data.pseudo}</Text>
          )
        })}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:wp('4%'),
  },
  title:{
    fontSize:22,
    marginBottom:hp('2%')
  },
});
const mapStateToProps = state => ({
  group: state.group,
});
export default connect(mapStateToProps)(GroupDetails);
