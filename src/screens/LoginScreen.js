import { StyleSheet, View, TextInput, Text } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-paper";

import * as firebase from "firebase";
import "firebase/firestore";
import HighFive from "../components/HighFive";

const firebaseConfig = {
  apiKey: "AIzaSyBImapFQjEogjB0ydnBdiS1sw5lrh9nEos",
  authDomain: "chat-ff89f.firebaseapp.com",
  projectId: "chat-ff89f",
  storageBucket: "chat-ff89f.appspot.com",
  messagingSenderId: "222601217947",
  appId: "1:222601217947:web:887ddfca6594c5bd19433e",
};

// to avoid creating the app every time
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// it's to access firebase quickly
const db = firebase.firestore();
// chat collection reference (we interact with reference in useEffect)
const usersRef = db.collection("users");

export default function App({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    readUser();
  }, []);

  // it's going to check in async storage if we have user
  async function readUser() {
    // if we don't have item user will be null
    const user = await AsyncStorage.getItem("user");
    // await AsyncStorage.removeItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handlePress() {
    // to generate random string for current user
    const _id = Math.random().toString(36).substring(7);
    const user = { _id, name };
    // we change user for the current value
    await AsyncStorage.setItem("user", JSON.stringify(user));
    
    setUser(user);
    await writeUser(user);
  }

  async function writeUser(user) {
    // we create array of promises
    // chatsRef.add(m) adding data to firebase
    // writes is a promise
    // HERE WE'RE SENDING THE DATA
    const userFromFirestore = await usersRef.add(user);
    setUserId(userFromFirestore.id);
  }

  async function logout() {
    await AsyncStorage.removeItem("user");
    setUser(null);
    setName("");
    if (userId) {
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
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <HighFive />

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          // the event we're listening to
          onChangeText={setName}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            onPress={handlePress}
            mode="contained"
          >
            Enter the chat
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HighFive />
      <Text
        style={{
          fontFamily: "Optima",
          fontSize: 40,
          marginBottom: 30,
          marginTop: 30,
        }}
      >
        Hello {user.name}!
      </Text>
      <StatusBar style="auto" />
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Study Room", { me: user })}
        buttonStyle={styles.button}
      >
        Enter to Study Room
      </Button>

      <View style={{ bottom: 100, position: "absolute" }}>
        <Button mode="outlined" onPress={async () => logout()}>
          Log out
        </Button>
      </View>
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
    borderRadius: 5,
  },
});
