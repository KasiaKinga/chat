// import React from "react";
// import { View, Text, StyleSheet, Button } from "react-native";

// const HomeScreen = ({ navigation }) => {
//   return (
//     <View>
//       <Text style={styles.text}>Hi there!</Text>
{
  /* <Button
        onPress={() => navigation.navigate("Animation")}
        title="Go to Animation Demo"
      /> */
}
{
  /* </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen; */
}

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Animated,
  PanResponder,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from "react-native";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class App extends Component {
  // export default class App extends Component {
  constructor() {
    super();
    this.position = new Animated.ValueXY(0, 0);
  }

  onPressHandler(event) {
    // console.log(event.nativeEvent);
    const { locationX, locationY } = event.nativeEvent;

    Animated.timing(this.position, {
      toValue: { x: locationX, y: locationY },
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={(event) => this.onPressHandler(event)}
        >
          <View style={{ flex: 3 }}>
            <ImageBackground
              source={require("../../assets/living-room.jpg")}
              style={styles.room}
            />
            <Animated.View style={this.position.getLayout()}>
              <Image
                source={require("../../assets/dog.png")}
                style={styles.image}
              />
            </Animated.View>

          </View>
        </TouchableWithoutFeedback>

        <View style={{ flex: 3 }}>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  square: {
    backgroundColor: "#000000",
    height: 35,
    width: 35,
    position: "absolute",
  },
  image: {
    height: 70,
    width: 70,
  },
  room: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    // resizeMode: "cover",
    // justifyContent: "center",
  },
});
