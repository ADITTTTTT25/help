import { createDrawerNavigator } from "react-navigation-drawer";
import CustomSidebarMenu from "./CustomSidebarMenu";
import { AppTabNavigator } from "./AppTabNavigator";
import MyDonationScreen from "../Screens/MyDonationScreen";
import SettingScreen from "../Screens/SettingScreen";
import NotificationScreen from "../Screens/NotificationScreen";
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    MyDonation: {
      screen: MyDonationScreen,
    },
    NotificationScreen:{
      screen: NotificationScreen
    },
    Settings: {
      screen: SettingScreen,
    },
  },
  { contentComponent: CustomSidebarMenu },
  { initialRouteName: "Home" }
);
