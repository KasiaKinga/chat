import React, { Component, useEffect } from "react";
import {
  // Platform,
  StyleSheet,
  // Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from "react-native";

//// firebase
import * as firebase from "firebase";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBImapFQjEogjB0ydnBdiS1sw5lrh9nEos",
  authDomain: "chat-ff89f.firebaseapp.com",
  projectId: "chat-ff89f",
  storageBucket: "chat-ff89f.appspot.com",
  messagingSenderId: "222601217947",
  appId: "1:222601217947:web:887ddfca6594c5bd19433e",
};
// to avoid creating the app every time we save
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
// LogBox.ignoreWarnings(["Setting a timer for a long period of time"]);
// it's to access firebase quickly
const db = firebase.firestore();
// chat collection reference (we interact with reference in useEffect)
const userActionsRef = db.collection("userActions");

export default (props) => {
  useEffect(() => {
    const unsubscribe = userActionsRef.onSnapshot((querySnapshot) => {
      const usersFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const userActions = doc.data();
          console.log("userActions", userActions);
          return userActions;
        })
        // we want the lastest action
        .sort((a, b) => a.createdAt - b.createdAt);

      // access the most recent move
      const returnedUserActions = usersFirestore.pop();
      if (returnedUserActions !== undefined) {
        if (props.name === returnedUserActions.name) {
          Animated.timing(props.location, {
            toValue: {
              x: returnedUserActions.locationX,
              y: returnedUserActions.locationY,
            },
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }
      }

      console.log("usersFirestore", usersFirestore);
      // appendUsers(usersFirestore);
    });
    return () => unsubscribe();
  }, []);

  const { location, isTyping, iconImg, name } = props;
  // getLayout gives current location for element
  return (
    <Animated.View style={location.getLayout()}>
      <Image
        source={iconImg}
        style={[isTyping ? styles.imageWithTyping : styles.image]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  square: {
    backgroundColor: "#000000",
    height: 35,
    width: 35,
    position: "absolute",
  },
  image: {
    height: 70,
    width: 70,
  },
  imageWithTyping: {
    height: 70,
    width: 70,
    borderWidth: 3,
    borderColor: "red",
  },
});
