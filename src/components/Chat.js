// while we initialite the app we want to wiped out the state of react
// @refresh reset
// import { StatusBar } from "expo-status-bar";
// import { createAppContainer } from "react-navigation";
import { StyleSheet, Keyboard } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { GiftedChat } from "react-native-gifted-chat";
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
const chatsRef = db.collection("chats");

export default function Chat(props) {
  // we declare state here
  const [user, setUser] = useState(null);
  // const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  
  // passed from parent to change the state in parent 
  const { setIsTyping } = props;


  useEffect(() => {
    readUser();
    // we don't want to listening all the time
    // the first query contains all the previous messages, and then only the new ones
    // onSnapshot will be called when we have updates in our collection
    // every time data changes, we have querySnapshot, we're going to react to changes, so we create variable which
    // HERE WE'RE LISTENING
    const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
      // we have all messages from firebase which are changing
      // onSnahpshot is listenning the changes
      const messagesFirestore = querySnapshot
        // return array of the docs changes since the last snapshot
        .docChanges()
        // we want to listen messages which are only added
        .filter(({ type }) => type === "added")
        // doc is actual data - message
        .map(({ doc }) => {
          // doc.data is method in doc object
          const message = doc.data();
          // actual shape of the message
          // we spread all properties of the message (id, text, createdAt, user)
          // toDate() which translate to JS object (?)
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        // it shows in correct order getTime() returns number
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      appendMessages(messagesFirestore);
    });
    //
    return () => unsubscribe();
  }, []);

  // appendMessages store return value from useCallback (the return value is function which will be called later)
  const appendMessages = useCallback(
    (newMessage) => {
      // receive the previous message and the current one
      // setter from hook receive callback function
      // setMessages(messages)
      setMessages((currentState) =>
        // GiftedChat.append(previousMessages, messages)
        [...newMessage, ...currentState]
      );
    },
    [messages]
  );

  // it's going to check in async storage if we have user
  async function readUser() {
    // if we don't have item user will null
    const user = await AsyncStorage.getItem("user");
    // await AsyncStorage.removeItem("user")
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handleSend(messages) {
    // we create array of promises
    // chatsRef.add(m) adding data to firebase
    const writes = messages.map((m) => chatsRef.add(m));
    //  HERE WE'RE SENDING THE DATA
    await Promise.all(writes);
    setIsTyping(false);
    Keyboard.dismiss();
  }

  return (
    <GiftedChat
      messages={messages}
      user={user}
      onSend={handleSend}
      onInputTextChanged={(event) => {
        if (event.length !== 0) {
          setIsTyping(true);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    padding: 15,
    borderColor: "gray",
    marginBottom: 20,
  },
});
