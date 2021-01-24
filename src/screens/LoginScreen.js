import { StyleSheet, View, TextInput, Text, Button } from "react-native";

import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StatusBar } from "expo-status-bar";

export default function App({ navigation }) {
  // we declare state here
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

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
    // setName(user.name);
    // () => {
    //   navigation.navigate("StudyRoom")
    // }
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
        onPress={() => navigation.navigate("Study Room")}
        title="Enter Study Room"
      />
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
