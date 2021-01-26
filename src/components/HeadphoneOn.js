import React from "react";
import LottieView from "lottie-react-native";
import { View, Text } from "react-native";

export default class HeadphoneOn extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <LottieView
          source={require("../../assets/speakers.json")}
          autoPlay
          loop
        />
        {/* <Text>Chat disabled</Text> */}
      </View>
    );
  }
}
