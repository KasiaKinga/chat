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

export default class AnimatedIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, isTyping, iconImg } = this.props;
    // getLayout gives current location for element
    return (
      <Animated.View style={location.getLayout()}>
        <Image
          source={iconImg}
          style={[isTyping ? styles.imageWithTyping : styles.image]}
        />
      </Animated.View>
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
});
