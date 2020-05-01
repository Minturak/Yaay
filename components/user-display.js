import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Ionicons from "react-native-vector-icons/Ionicons"

class UserDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.user}>{this.props.user.data.pseudo}</Text>
        {this.props.isAdmin && (this.props.nbAdmins>1||this.props.nbAdmins===undefined)&&
          <Menu>
            <MenuTrigger>
              <Ionicons name={"ios-more"} size={25} style={styles.icon}/>
            </MenuTrigger>
            <MenuOptions>
              {this.props.role!==2 &&
                <MenuOption onSelect={() => this.props.setUserRole(this.props.user.id,'members')} text='Définir comme membre'/>
              }
              {this.props.role!==1 &&
                <MenuOption onSelect={() => this.props.setUserRole(this.props.user.id,'organizers')} text='Définir comme organisateur'/>
              }
              {this.props.role!==0 &&
                <MenuOption onSelect={() => this.props.setUserRole(this.props.user.id,'admins')} text='Définir comme admin'/>
              }
              <MenuOption onSelect={() => this.props.removeUser(this.props.user.id,this.props.user.data.pseudo)}>
                <Text style={{color: 'red'}}>Retirer</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
  },
  user:{
    paddingVertical:hp('1%'),
    flex:1
  },
});
export default UserDisplay;
