// while we initialite the app we want to wiped out the state of react
// @refresh reset
import { StatusBar } from "expo-status-bar";
// import { createAppContainer } from "react-navigation";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  // LogBox,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-community/async-storage";
// import { createStackNavigator } from "react-navigation-stack";
// import HomeScreen from "./src/screens/HomeScreen";
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

export default function App() {
  // we declare state here
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [messages, setMessages] = useState([]);
  console.log("messages", messages);
  // const useState = ([]) => {
  //   return [[], func]
  // }
  // const arr = ['one', 'two']
  // const [one, two] = arr;

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
      // console.log(messagesFirestore);
      appendMessages(messagesFirestore);
      // console.log("messagesFirestore", messagesFirestore);
      // const nextMessages = [...messages, ...messagesFirestore];
      // console.log("nextMessages", nextMessages);
      // setMessages(nextMessages);
    });
    // 
    return () => unsubscribe();
  }, []);

  /**
   * const closureFunc = (cb) => {
   *  ....(calls the cb function)
   *  return (num) => {
   *    return num + 1
   *  }
   * } 
   * 
   * const responseOfClosure = closureFun([1,2,3])
   * const valueFromResponseOfClosure = responseOfClosure(1)
   * 
   * 
   */


  // appendMessages store return value from useCallback (the return value is function which will be called later)
  const appendMessages = useCallback((newMessage) => {
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

  // (messages) => {
  //   // receive the previous message and the current one
  //   // setter from hook receive callback function
  //   // setMessages(messages)
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // },
  // [messages]
  // );

  // it's going to check in async storage if we have user
  async function readUser() {
    // if we don't have item user will null
    const user = await AsyncStorage.getItem("user");
    // await AsyncStorage.removeItem("user")
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handlePress() {
    // to generate random string for current user
    const _id = Math.random().toString(36).substring(7);
    const user = { _id, name };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    // we change user for the current value
    setUser(user);
  }

  async function handleSend(messages) {
    // we create array of promises
    // chatsRef.add(m) adding data to firebase
    const writes = messages.map((m) => chatsRef.add(m));
    //  HERE WE'RE SENDING THE DATA
    await Promise.all(writes);
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          // event we're listening
          onChangeText={setName}
        />
        <Button onPress={handlePress} title="Enter the chat" />
      </View>
    );
  }

  return <GiftedChat messages={messages} user={user} onSend={handleSend} />;
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

// const navigator = createStackNavigator(
//   {
//     Home: {
//       screen: HomeScreen,
//       // navigationOptions: {
//       //   header: null,
//       // },
//     },
//   },
//   {
//     initialRouteName: "Home",
//   }
// );

// export default createAppContainer(navigator);
