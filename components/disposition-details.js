import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity  } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from "moment"
import { dbo } from '../api/dbo';

class DispositionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members:[],
    };
  }
  componentDidMount=_=>{
    let members=[];
    this.props.dispo.members.map(uid=>{
      dbo.getUserData(uid).then(doc=>{
        members.push({id:uid,pseudo:doc.data().pseudo})
      }).then(_=>{
        this.setState({members:members})
      })
    })
  }
  getName=(uid)=>{
    let userName='';
    this.state.members.map(user=>{
      if(uid===user.id){userName=user.pseudo}
    })
    return (<Text>{userName}</Text>);
  }
  changeDispo=(dateId)=>{
    console.log(dateId);
    this.props.changeDispo(dateId)
  }
  render() {
    let dispo = this.props.dispo
    let user = this.props.user
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Titre : {dispo.name}</Text>
        <Text>Description : {dispo.desc}</Text>
        <View style={styles.tableContainer}>
          <View>
            <View style={styles.firstCell}></View>
            {dispo.members.map(uid=>{
              return(
                <View style={styles.cellFixed}>
                  {this.getName(uid)}
                </View>
              )
            })}
          </View>
          <ScrollView style={styles.table} horizontal={true}>
            {dispo.dates.map(date=>{
              if(date.selected){
                return(
                  <View>
                    <View style={styles.thead} key={date.id}>
                      <Text>{moment(date.date).format("DD.MM")}</Text>
                    </View>
                    {dispo.members.map(uid=>{
                      if(uid===user.user.uid){
                        return(
                        <View style={styles.cell}>
                          <TouchableOpacity onPress={()=>{this.changeDispo(date.id)}}>
                            <Text>Hello</Text>
                          </TouchableOpacity>
                        </View>
                        )
                      }else{
                        return(
                          <View style={styles.cell}>
                            <Text>{uid}</Text>
                          </View>
                        )
                      }
                    })}
                  </View>
                )
              }
            })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  root:{
    padding:hp('2%')
  },
  title:{
    fontSize:18
  },
  tableContainer:{
    flexDirection:'row',
    marginTop:hp('2%')
  },
  table:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#ff0000',
  },
  thead:{
    borderWidth:1,
    borderColor:'#000000',
    height:hp('5%'),
    paddingRight:wp('3%'),
    paddingLeft:wp('3%'),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell:{
    borderWidth:1,
    borderColor:'#0000ff',
  },
  firstCell:{
    borderWidth:1,
    borderColor:'#00ffff',
    height:hp('5%')
  },
  cellFixed:{
    borderWidth:1,
    borderColor:'#00ff00',
  }
});
export default DispositionDetails;