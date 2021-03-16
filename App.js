import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SignUpLoginScreen from "./Screens/SignUpLoginScreen";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AppTabNavigator } from "./components/AppTabNavigator";
import { AppDrawerNavigator } from "./components/AppDrawerNavigator";
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
const SwitchNav = createSwitchNavigator({
  SignUpLoginScreen: { screen: SignUpLoginScreen },
  Drawer: { screen: AppDrawerNavigator },
  BottomTab : {screen:AppTabNavigator}
});

const AppContainer = createAppContainer(SwitchNav);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
