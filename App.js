import React from 'react';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from "./components/tabNavigator";
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore'
import { MenuProvider } from 'react-native-popup-menu';

// The code below hides the message of Yellow box (on Android)
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

//The code bellow allow to write to firestore
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const store = configureStore();

export default function App(){
  let [fontsLoaded] = useFonts({
    'FontAwesome': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
    'Ionicons': require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    'Material Design Icons': require('./assets/fonts/MaterialIcons.ttf'),
    'Material Icons': require('./assets/fonts/MaterialIcons.ttf'),
    'MaterialIcons': require('./assets/fonts/MaterialIcons.ttf'),
    'MaterialCommunityIcons': require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    'Material Community Icons': require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }else{
    return (
      <Provider store={store}>
        <MenuProvider>
          <NavigationContainer>
            <TabNavigator/>
          </NavigationContainer>
        </MenuProvider>
      </Provider>
    );
  }
}
