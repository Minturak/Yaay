import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux'
import {dbo} from "../api/dbo"
import { db } from '../firebase';
import DispositionCard from '../components/disposition-card';

class DispositionsList extends Component {
  constructor(props) {
    super(props);
    this.state={
        dispos:[],
    }
  }
  componentDidMount(){
    this.props.groups.map(group=>{
        dbo.getGroupData(group.id).then(doc=>{
            if(doc.data().dispos!==undefined){
                doc.data().dispos.map(id=>{
                    this.dispoSnapshot(id);
                })
            }
        })
    })
  }
  dispoSnapshot=(id)=>{
    db.collection('dispos').doc(id).onSnapshot(doc=>{
        this.updateDispos(doc,id);
    })
  }
  updateDispos=(doc,id)=>{
    let dispos = this.state.dispos;
    dispos.push({id:id,...doc.data()})
    this.setState({dispos:dispos})
  }
  render() {
    return (
      <View>
        <FlatList
            data={this.state.dispos}
            renderItem={({item})=>
                <DispositionCard 
                    dispo={item}
                    navigation={this.props.navigation}
                />
            }
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
    groups: state.groups,
  });
export default connect(mapStateToProps)(DispositionsList);
