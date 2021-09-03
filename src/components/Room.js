import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AnimatedIcon from "./AnimatedIcon";

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
const usersRef = db.collection("users");
const userActionsRef = db.collection("userActions");

export default (props) => {
  const [users, setUsers] = useState([]);
  const myPosition = useRef(new Animated.ValueXY(0, 0)).current;
  const theirPositions = useRef(new Animated.ValueXY(0, 0)).current;

  useEffect(() => {
    // we don't want to listen to all the time
    // the first query contains all the previous messages, and then only the new ones
    // onSnapshot will be called when we have updates in our collection
    // every time data changes, we have querySnapshot, we're going to react to changes, so we create variable
    // HERE WE'RE LISTENING
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      // we have all messages from firebase which are changing
      // onSnahpshot is listenning the changes
      const usersFirestore = querySnapshot
        // return array of the docs changes since the last snapshot
        .docChanges()
        // we want to listen messages which are only added
        .filter(({ type }) => type === "added")
        // doc is actual data - message
        .map(({ doc }) => {
          const users = doc.data();
          return users;
        });
      appendUsers(usersFirestore);
    });
    return () => unsubscribe();
  }, []);

  const appendUsers = useCallback(
    (newUser) => {
      // receive the previous message and the current one
      setUsers(
        (currentState) => {
          let noDuplicates = {};
          let uniqueUsers = [];
          const allUsers = [...newUser, ...currentState];
          allUsers.forEach((user) => {
            if (!noDuplicates[user.name]) {
              noDuplicates[user.name] = true;
              uniqueUsers.push(user);
            }
          });
          return uniqueUsers;
        }
      );
    },
    [users]
  );

  // to get current touching postion
  async function onPressHandler(event) {
    // nativeEvent is touch location (find touching location)
    const { locationX, locationY } = event.nativeEvent;

    // WRITE LOCATION IN FIRESTORE FROM HERE
    await userActionsRef.add({
      name: myself,
      locationX,
      locationY,
      createdAt: new Date().getTime(),
    });
  }

  // to get current touching postion
  function onDisabledChat() {
    setIsListening(!isListening);
  }

  const { myself, isListening, setIsListening } = props;

  const icons = {
    Cat: require("../../assets/cat.png"),
    Doggy: require("../../assets/dog.png"),
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={(event) => onPressHandler(event)}>
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={require("../../assets/living-room.jpg")}
            style={styles.room}
          />
          <TouchableOpacity onPress={onDisabledChat}>
            <View style={styles.backgroundHeadphones}>
              <Image
                source={require("../../assets/headphones.png")}
                style={styles.headphones}
              />
            </View>
          </TouchableOpacity>

          {users.map((user, idx) => {
            if (user.name === myself) {
              console.log("user.name", user);
              console.log("here", icons);
              return (
                <AnimatedIcon
                  key={idx}
                  name={myself}
                  location={myPosition}
                  iconImg={icons[myself]}
                  isListening={isListening}
                />
              );
            } else {
              return (
                <AnimatedIcon
                  key={idx}
                  name={user.name}
                  location={theirPositions}
                  iconImg={icons[user.name]}
                  isListening={false}
                />
              );
            }
          })}
        </View>
      </TouchableWithoutFeedback>
    </View>
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
  room: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  headphones: {
    width: 50,
    height: 50,
  },
  backgroundHeadphones: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 40,
    width: 70,
    height: 70,
    marginTop: 255,
    marginLeft: 8,
  },
});
