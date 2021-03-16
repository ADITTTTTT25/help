import ExchangeScreen from "../Screens/ExchangeScreen";
import HomeScreen from "../Screens/HomeScreen";
import {AppStackNavigator} from "./AppStackNavigator";
import { createBottomTabNavigator } from "react-navigation-tabs";
import React from "react";
import { Image } from "react-native";

export const AppTabNavigator = createBottomTabNavigator({
  AppStackNavigator: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../assets/adaptive-icon.png")}
        />
      ),
      tabBarLabel: "Home Screen",
    },
  },
  ExchangeScreen: {
    screen: ExchangeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../assets/favicon.png")}
        />
      ),
      tabBarLabel: "Exchange",
    },
  },
});
