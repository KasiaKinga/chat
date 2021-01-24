import React, { Component } from "react";
import {
  // Platform,
  StyleSheet,
  // Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from "react-native";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class Room extends Component {
  // export default class App extends Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY(0, 0);
  }

  onPressHandler(event) {
    const { locationX, locationY } = event.nativeEvent;

    Animated.timing(this.position, {
      toValue: { x: locationX, y: locationY },
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const { isTyping } = this.props;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={(event) => this.onPressHandler(event)}
        >
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={require("../../assets/living-room.jpg")}
              style={styles.room}
            />
            <Animated.View style={this.position.getLayout()}>
              <Image
                source={require("../../assets/dog.png")}
                style={[isTyping ? styles.imageWithTyping : styles.image]}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
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
  imageWithTyping: {
    height: 70,
    width: 70,
    borderWidth: 3,
    borderColor: "red",
  },
  room: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    // padding: 10,
    // resizeMode: "cover",
    // justifyContent: "center",
  },
});
