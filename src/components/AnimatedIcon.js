import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { TypingAnimation } from "react-native-typing-animation";

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

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const userActionsRef = db.collection("userActions");
const typingActionRef = db.collection("typingAction");

export default (props) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    //// LITENING CHANGING THE LOCATION
    const unsubscribe = userActionsRef.onSnapshot((querySnapshot) => {
      const usersFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const userActions = doc.data();
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
    });

    //// LITENING TYPING
    const unsubscribeTyping = typingActionRef.onSnapshot((querySnapshot) => {
      const userTypingFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const userTyping = doc.data();
          return userTyping;
        })
        .sort((a, b) => a.createdAt - b.createdAt);
      // access the most recent move
      const returnedTypingAction = userTypingFirestore.pop();
      
      if (returnedTypingAction !== undefined) {
        if (props.name === returnedTypingAction.name) {
          setIsTyping(returnedTypingAction.typing);
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, []);

  const { location, iconImg, isListening } = props;
  const headphone = require("../../assets/headphones.png");
  
  return (
    <Animated.View style={location.getLayout()}>
      {isListening && <Image source={headphone} style={styles.headphone} />}
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
