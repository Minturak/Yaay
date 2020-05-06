import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import moment from "moment"

class DispositionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit:false,
      newDispos:[],
    };
  }
  componentDidMount=_=>{
    this.setState({newDispos:this.props.userDispos})
  }
  toggleEdit=_=>{
    this.setState({newDispos:this.props.userDispos})
    this.setState({edit:!this.state.edit})
  }
  saveChange=_=>{
    this.props.changeDispo(this.state.newDispos)
    this.toggleEdit();
  }
  getName=(uid)=>{
    let userName='';
    this.props.members.map(user=>{
      if(uid===user.id){userName=user.pseudo}
    })
    return (<Text>{userName}</Text>);
  }
  changeDispo=(dateId)=>{
    let dispos = this.state.newDispos;
    dispos[dateId]=!dispos[dateId]
    this.setState({newDispos:dispos})
  }
  createEvent=_=>{
    this.props.createEvent();
  }
  render() {
    let dispo = this.props.dispo
    let user = this.props.user
    return (
      <View style={styles.root}>
        <View style={styles.titleAndIcons}>
          <Text style={styles.title}>Titre : {dispo.name}</Text>
          {this.props.canUpdate&&
            <View style={styles.icons}>
              <TouchableOpacity onPress={this.createEvent}>
                <MaterialIcons name={"queue"} size={30}/>
              </TouchableOpacity>
            </View>
          }
        </View>
        <Text>Description : {dispo.desc}</Text>
        {this.state.edit?(
          <MaterialIcons name={"save"} size={30} style={styles.icon} onPress={this.saveChange}/>
        ):(
          <MaterialIcons name={"edit"} size={30} style={styles.icon} onPress={this.toggleEdit}/>
        )}
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
              return(
                <View>
                  <View style={styles.thead} key={date.id}>
                    <Text>{moment(date.date).format("DD.MM")}</Text>
                  </View>
                  {dispo.members.map(uid=>{
                    if(uid===user.user.uid){
                      return(
                      <View style={styles.cell}>
                        {this.state.edit?(
                          <CheckBox
                            checked={this.state.newDispos[date.id]}
                            onPress={()=>{this.changeDispo(date.id)}}
                            iconType={'font-awesome'}
                          />
                        ):(
                          this.state.newDispos[date.id]?(
                              <MaterialIcons name={"check"} size={25} style={styles.iconCheck}/>
                            ):(
                              <MaterialIcons name={"close"} size={25} style={styles.iconCross}/>
                            )
                        )}
                      </View>
                      )
                    }else{
                      return(
                        <View style={styles.cell}>
                          {date.available.includes(uid)?(
                              <MaterialIcons name={"check"} size={25} style={styles.iconCheck}/>
                            ):(
                              <MaterialIcons name={"close"} size={25} style={styles.iconCross}/>
                            )
                          }
                        </View>
                      )
                    }
                  })}
                </View>
              )
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
    fontSize:18,
    flex:1
  },
  titleAndIcons:{
    flexDirection:'row',
  },
  icon:{
    alignSelf:'flex-end'
  },
  iconCheck:{
    color:"#249E6B",
  },
  iconCross:{
    color:"#d93030"
  },
  icons:{
    alignSelf:'flex-end',
    flexDirection:'row',
  },
  tableContainer:{
    flexDirection:'row',
    marginTop:hp('2%')
  },
  table:{
    flexDirection:'row',
  },
  thead:{
    borderWidth:1,
    borderLeftWidth:0,
    height:hp('5%'),
    paddingRight:wp('3%'),
    paddingLeft:wp('3%'),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight:hp('5%'),
    minHeight:hp('5%'),
  },
  cell:{
    borderBottomWidth:1,
    borderRightWidth:1,
    minHeight:hp('8%'),
    maxHeight:hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  firstCell:{
    height:hp('5%'),
    borderBottomWidth:1,
    borderRightWidth:1,
  },
  cellFixed:{
    borderWidth:1,
    borderRightWidth:1,
    borderTopWidth:0,
    paddingHorizontal:wp('1%'),
    paddingVertical:hp('1%'),
    minHeight:hp('8%'),
    maxHeight:hp('8%'),
  }
});
export default DispositionDetails;