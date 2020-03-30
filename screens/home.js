import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux'
import { setCategories } from '../redux/actions/setCategories';
import { bindActionCreators } from 'redux';

import {dbo} from '../dataObjects/dbo';

class Home extends Component{
  componentDidMount(){
    console.log(this.props);
    if(this.props.categories===undefined){
      this.fetchCategories();
    }
    if(this.props.user === undefined){
      this.props.navigation.replace('Login')
    }
  }
  fetchCategories(){
    let categories=[];
    dbo.getCategories().then(doc=>{
      doc.data().labels.map(label=>{
        categories.push(label);
      })
      this.props.setCategories(categories);
    })
  }
  render(){
    return(
      <View>
        <Text>Ecran home</Text>
        <Button
          title="To event"
          onPress={() => this.props.navigation.navigate('EventForm')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height:hp('100%')
  },
  floating:{
    position: 'absolute',
    bottom: 10,
    right: 10,
  }
});
const mapStateToProps = state => ({
  user: state.user,
  categories: state.categories,
});
const mapDispatchToProps = dispatch => bindActionCreators(
    {
      setCategories
    },
    dispatch,
)
export default connect (mapStateToProps,mapDispatchToProps)(Home);
