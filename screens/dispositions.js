import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux'
import { selectDispo } from '../redux/actions/selectDispo';
import { bindActionCreators } from 'redux';
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
    let uid = this.props.user.user.uid;
    this.listenerDispos(uid)
  }
  listenerDispos(uid){
    db.collection('dispos').where("members","array-contains",uid).onSnapshot(doc=>{
      let dispos = [];
      doc.forEach(dispo=>{
        dispos.push({id:dispo.id,...dispo.data()})
      })
      this.setState({dispos:dispos})
    })
  }
  selectDispo=(id)=>{
    let dispo = {}
    this.state.dispos.forEach(d=>{
      if(d.id===id){
        dispo=d
      }
    })
    this.props.selectDispo(dispo);
    this.props.navigation.navigate('DispositionDetails');
  }
  render() {
    return (
      <View>
        <FlatList
          data={this.state.dispos}
          renderItem={({item})=>
            <DispositionCard 
              dispo={item}
              selectDispo={this.selectDispo}
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
  user: state.user,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    selectDispo,
  },
  dispatch,
)
export default connect(mapStateToProps,mapDispatchToProps)(DispositionsList);
