import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Chat from "../components/Chat";
import Room from "../components/Room";

const StudyRoomScreen = () => {
  const [isTyping, setIsTyping] = useState(false);
  // console.log("typing..", isTyping);

  return (
    <View style={styles.container}>
      <View style={styles.containerForRoom}>
        <Room isTyping={isTyping} />
      </View>
      <View style={styles.containerForChat}>
        <Chat setIsTyping={setIsTyping}/>
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
});

export default StudyRoomScreen;
