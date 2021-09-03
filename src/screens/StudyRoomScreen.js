import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Chat from "../components/Chat";
import Room from "../components/Room";
import HeadphoneOn from "../components/HeadphoneOn";

const StudyRoomScreen = ({ navigation }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const myself = navigation.state.params.me.name;
  console.log("myself", myself)

  return (
    <View style={styles.container}>
      <View style={styles.containerForRoom}>
        <Room
          isTyping={isTyping}
          myself={myself}
          isListening={isListening}
          setIsListening={setIsListening}
        />
      </View>
      <View style={styles.containerForChat}>
        {isListening ? <HeadphoneOn /> : <Chat setIsTyping={setIsTyping} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  containerForRoom: {
    flex: 1.5,
    borderColor: "#F5FCFF",
  },
  containerForChat: {
    flex: 2,
    marginTop: 10,
  },
  containerToDisabled: {
    width: 100,
    height: 100,
    backgroundColor: "yellow",
  },
});

export default StudyRoomScreen;
