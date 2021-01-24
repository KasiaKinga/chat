import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "./src/screens/LoginScreen";
import StudyRoomScreen from "./src/screens/StudyRoomScreen";
const StudyRoom = "Study Room";

const navigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      // navigationOptions: {
      //   header: null,
      // },
      // headerShown: false
    },
    [StudyRoom]: StudyRoomScreen,
  },
  {
    initialRouteName: "Login",
  }
);

export default createAppContainer(navigator);
