import { FloatingAction } from "react-native-floating-action";
import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

class FloatingButton extends Component {

  render() {
    return (
      <FloatingAction
        actions={actions}
        onPressItem={name => {
          console.log(`selected button: ${name}`);
          if (name === 'bt_ajouter_evenement') {
            this.props.navigation.navigate('Form');
          }
        }}
      />
    )
  }
}

const actions = [
  {
    text: "Ajouter événement",
    icon: require("../ressources/form.png"),
    name: "bt_ajouter_evenement",
    position: 1
  },
];

export default FloatingButton;
