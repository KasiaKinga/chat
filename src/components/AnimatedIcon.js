import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from "react-native";
import { TypingAnimation } from "react-native-typing-animation";
import AnimatedIcon from "./AnimatedIcon";

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
const typingActionRef = db.collection("typingAction");

export default (props) => {
  const [isTyping, setIsTyping] = useState(false);
  // const [isListening, setIsListening] = usetState(true);

  useEffect(() => {
    //// LITENING CHANGING THE LOCATION
    const unsubscribe = userActionsRef.onSnapshot((querySnapshot) => {
      const usersFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const userActions = doc.data();
          // console.log("userActions", userActions);
          return userActions;
        })
        // we want the lastest action
        .sort((a, b) => a.createdAt - b.createdAt);

      // access the most recent move
      const returnedUserActions = usersFirestore.pop();

      if (returnedUserActions !== undefined) {
        if (props.name === returnedUserActions.name) {
          // props.location bind the animation instance with the 'icon'
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
      // appendUsers(usersFirestore);
    });

    //// LITENING TYPING
    const unsubscribeTyping = typingActionRef.onSnapshot((querySnapshot) => {
      const userTypingFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const userTyping = doc.data();
          // console.log("HERE userTyping", userTyping);
          return userTyping;
        })
        .sort((a, b) => a.createdAt - b.createdAt);
      // we want the lastest action

      // access the most recent move
      const returnedTypingAction = userTypingFirestore.pop();
      // console.log("returnObj", returnedTypingAction);
      if (returnedTypingAction !== undefined) {
        // console.log("hi");
        if (props.name === returnedTypingAction.name) {
          setIsTyping(returnedTypingAction.typing);
          // console.log("AAAAAAA", returnedTypingAction.typing);
        }
      }
      // we want the lastest action
      // .sort((a, b) => a.createdAt - b.createdAt);

      // access the most recent move
      // const returnedUserActions = usersFirestore.pop();
      // if (returnedUserActions !== undefined) {
      //   if (props.name === returnedUserActions.name) {
      //     Animated.timing(props.location, {
      //       toValue: {
      //         x: returnedUserActions.locationX,
      //         y: returnedUserActions.locationY,
      //       },
      //       duration: 1000,
      //       useNativeDriver: false,
      //     }).start();
      //   }
      // }
      // appendUsers(usersFirestore);
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, []);

  const { location, iconImg } = props;
  // getLayout gives current location for element
  const headphone = require("../../assets/headphones.png");
  return (
    <Animated.View style={location.getLayout()}>
      {false && <Image source={headphone} style={styles.headphone} />}
      {isTyping && (
        <TypingAnimation
          dotColor="black"
          dotMargin={3}
          dotAmplitude={3}
          dotSpeed={0.09}
          dotRadius={2.5}
          dotX={12}
          dotY={6}
          style={styles.cloud}
        />
      )}

      <Image
        source={iconImg}
        style={styles.image}
        // style={[isTyping ? styles.imageWithTyping : styles.image]}
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
  cloud: {
    backgroundColor: "white",
    width: 30,
    height: 20,
    borderRadius: 8,
    marginLeft: 70,
    marginTop: -10,
    position: "absolute",
  },
  headphone: {
    width: 100,
    height: 100,
    marginTop: -40,
    marginLeft: -15,
    position: "absolute",
  },
});
