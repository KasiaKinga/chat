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

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const chatsRef = db.collection("chats");
const typingActionRef = db.collection("typingAction");

export default function Chat(props) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const { setIsTyping } = props;

  useEffect(() => {
    readUser();
    const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        // return array of the docs changes since the last snapshot
        .docChanges()
        // we want to listen messages which are only added
        .filter(({ type }) => type === "added")
        // doc is actual data - message
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        // it shows in correct order getTime() returns number
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  // appendMessages store return value from useCallback (the return value is function which will be called later)
  const appendMessages = useCallback(
    (newMessage) => {
      // receive the previous message and the current one
      // setter from hook receive callback function
      // setMessages(messages)
      setMessages((currentState) =>
        [...newMessage, ...currentState]
      );
    },
    [messages]
  );

  // it's going to check in async storage if we have user
  async function readUser() {
    // if we don't have item user will be null
    const user = await AsyncStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handleSend(messages) {
    const writes = messages.map((m) => chatsRef.add(m));
    //  HERE WE'RE SENDING THE DATA FROM HERE
    await Promise.all(writes);
    setIsTyping(false);

    // SEND END OF TYPING ACTION TO FIRESTORE
    await typingActionRef.add({
      name: user.name,
      typing: false,
      createdAt: new Date().getTime(),
    });

    Keyboard.dismiss();
  }

  async function sendTypingAction(event) {
    // WRITE TYPING ACTION IN FIRESTORE FROM HERE
    if (event.length === 1) {
      await typingActionRef.add({
        name: user.name,
        typing: true,
        createdAt: new Date().getTime(),
      });
    }
    if (event.length !== 0) {
      // SEND BEGINNGING TO TYPING TO FIRESTORE
      setIsTyping(true);
    }
  }

  return (
    <GiftedChat
      messages={messages}
      user={user}
      onSend={handleSend}
      onInputTextChanged={async (event) => sendTypingAction(event)}
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
