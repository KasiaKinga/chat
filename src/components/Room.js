import React, { useEffect, useState, useCallback } from "react";
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
import AnimatedIcon from "./AnimatedIcon";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";

//// firebase
import * as firebase from "firebase";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBImapFQjEogjB0ydnBdiS1sw5lrh9nEos",
  authDomain: "chat-ff89f.firebaseapp.com",
  projectId: "chat-ff89f",
  storageBucket: "chat-ff89f.appspot.com",
  messagingSenderId: "222601217947",
  appId: "1:222601217947:web:887ddfca6594c5bd19433e",
};
// to avoid creating the app every time we save
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
// LogBox.ignoreWarnings(["Setting a timer for a long period of time"]);
// it's to access firebase quickly
const db = firebase.firestore();
// chat collection reference (we interact with reference in useEffect)
const usersRef = db.collection("users");

export default (props) => {
  // console.log("props", props);
  // export default class App extends Component {
  // not state! instance of animation
  const [users, setUsers] = useState([]);
  // console.log(users);
  let position = new Animated.ValueXY(0, 0);

  useEffect(() => {
    // console.log("enter to useEffect");
    // readUser();
    // we don't want to listening all the time
    // the first query contains all the previous messages, and then only the new ones
    // onSnapshot will be called when we have updates in our collection
    // every time data changes, we have querySnapshot, we're going to react to changes, so we create variable which
    // HERE WE'RE LISTENING
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      // we have all messages from firebase which are changing
      // onSnahpshot is listenning the changes
      const usersFirestore = querySnapshot
        // return array of the docs changes since the last snapshot
        .docChanges()
        // we want to listen messages which are only added
        .filter(({ type }) => type === "added")
        // doc is actual data - message
        .map(({ doc }) => {
          // doc.data is method in doc object
          const users = doc.data();
          // console.log("users from firebase", users);
          // actual shape of the message
          // we spread all properties of the message (id, text, createdAt, user)
          // toDate() which translate to JS object (?)
          return users;
          // return { ...users, createdAt: users.createdAt.toDate() };
        });
      // it shows in correct order getTime() returns number
      // .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // appendMessages(messagesFirestore);
      // console.log("usersFirestore", usersFirestore);
      appendUsers(usersFirestore);
    });
    //
    return () => unsubscribe();
  }, []);

  const appendUsers = useCallback(
    (newUser) => {
      // receive the previous message and the current one
      // setter from hook receive callback function
      // setMessages(messages)
      setUsers(
        (currentState) => {
          let noDuplicates = {};
          let uniqueUsers = [];
          const allUsers = [...newUser, ...currentState];
          allUsers.forEach((user) => {
            if (!noDuplicates[user.name]) {
              noDuplicates[user.name] = true;
              uniqueUsers.push(user);
            }
          });
          return uniqueUsers;
        }
        // GiftedChat.append(previousMessages, messages)
      );
    },
    [users]
  );

  // to get current touching postion
  function onPressHandler(event) {
    // nativeEvent is touch location (find touching location)
    const { locationX, locationY } = event.nativeEvent;

    // 2nd arg updated the values of this.postion instance
    Animated.timing(position, {
      toValue: { x: locationX, y: locationY },
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  const { isTyping, myself } = props;
  console.log(myself);
  const icons = {
    Cat: require("../../assets/cat.png"),
    Doggy: require("../../assets/dog.png"),
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={(event) => onPressHandler(event)}>
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={require("../../assets/living-room.jpg")}
            style={styles.room}
          />

          {users.map((user, idx) => {
            if (user.name === myself) {
              return (
                <AnimatedIcon
                  key={idx}
                  location={position}
                  isTyping={isTyping}
                  iconImg={icons[myself]}
                  // iconImg={
                  //   idx === 0
                  //     ? require("../../assets/cat.png")
                  //     : require("../../assets/dog.png")
                  // }
                />
              );
            } else {
              return (
                <Image
                  key={idx}
                  style={styles.image}
                  source={icons[user.name]}
                ></Image>
              );
            }
          })}

          {/* <Animated.View style={this.position.getLayout()}>
              <Image
                source={require("../../assets/dog.png")}
                style={[isTyping ? styles.imageWithTyping : styles.image]}
                
              />
            </Animated.View> */}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

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
