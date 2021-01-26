import React from "react";
import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";

export default class HighFive extends React.Component {
  render() {
    return (
      <View
        style={{
          height: 200,
          width: 200,
          top: 100,
          position: "absolute",
        }}
      >
        <LottieView
          source={require("../../assets/high-five.json")}
          autoPlay
          loop
        />
        <Text style={styles.company}>company</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  company: {
    fontFamily: "Bradley Hand",
    fontSize: 40,
    // marginBottom: 80,
  },
});
