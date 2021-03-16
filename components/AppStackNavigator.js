import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../Screens/HomeScreen"
import ReceiverDetails from "../Screens/ReceiverDetails"
export const AppStackNavigator=createStackNavigator({
       HomeScreen: {
            screen: HomeScreen ,
            navigationOptions: {
                headerShown : false
            }
        },
        ReceiverDetails: {
            screen: ReceiverDetails ,
            navigationOptions: {
                headerShown : false
            }
        },

    },
    {
        initialRouteName: "HomeScreen"
    }


)