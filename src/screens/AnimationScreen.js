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
} from "react-native";

type Props = {};
export default class App extends Component<Props> {
// export default class App extends Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0);
    Animated.spring(this.position, {
      toValue: { x: 300, y: 100 },
    }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={this.position.getLayout()}>
          <View style={[styles.square]}></View>
        </Animated.View>
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
});
