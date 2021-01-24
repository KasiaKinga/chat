import { StyleSheet, View, TextInput, Text, Button } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StatusBar } from "expo-status-bar";

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
const usersRef = db.collection("users");

export default function App({ navigation }) {
  // we declare state here
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    readUser();
  }, []);

  // it's going to check in async storage if we have user
  async function readUser() {
    // if we don't have item user will null
    const user = await AsyncStorage.getItem("user");
    // await AsyncStorage.removeItem("user");
    if (user) {
      setUser(JSON.parse(user));
      // setName(user.name);
    }
  }

  async function handlePress() {
    // to generate random string for current user
    const _id = Math.random().toString(36).substring(7);
    const user = { _id, name };

    await AsyncStorage.setItem("user", JSON.stringify(user));
    // we change user for the current value

    setUser(user);
    await writeUser(user);
    // setName(user.name);
    // () => {
    //   navigation.navigate("StudyRoom")
    // }
  }

  async function writeUser(user) {
    // console.log("user in login", user);
    // we create array of promises
    // chatsRef.add(m) adding data to firebase
    // writes is a promise
    //  HERE WE'RE SENDING THE DATA
    const userFromFirestore = await usersRef.add(user);
    setUserId(userFromFirestore.id);
  }

  // async function enterToStudyRoom() {
  //   navigation.navigate("Study Room");

  // }

  async function logout() {
    await AsyncStorage.removeItem("user");
    setUser(null);
    setName("");

    usersRef
      .doc(userId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
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

  // return <GiftedChat messages={messages} user={user} onSend={handleSend} />;
  return (
    <View style={styles.container}>
      <Text>Hello {user.name}!</Text>
      <StatusBar style="auto" />
      <Button
        // onSend={handleSend}
        onPress={() => navigation.navigate("Study Room", { me: user })}
        title="Enter Study Room"
      />

      <Button title="Logout" onPress={async () => logout()} />
    </View>
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
