import firebase from "firebase";
import "firebase/firestore"

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDK1h6dGRxpBfL13vrHzVMQbYZXXg24IAQ",
  authDomain: "yaay-89a66.firebaseapp.com",
  databaseURL: "https://yaay-89a66.firebaseio.com",
  projectId: "yaay-89a66",
  storageBucket: "yaay-89a66.appspot.com",
  messagingSenderId: "315917189738",
  appId: "1:315917189738:web:c095758ad20ad3c01e0013",
  measurementId: "G-1QYTFB55CN"
});

const db = firebaseApp.firestore();

export { db };
