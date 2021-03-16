import ExchangeScreen from '../Screens/ExchangeScreen'
import HomeScreen from '../Screens/HomeSreen'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import React from 'react'
import {Image} from 'react-native';

export const AppTabNavigator = createBottomTabNavigator({
    HomeScreen:{screen:HomeScreen,
        navigationOptions:{
            tabBarIcon:<Image style={{width:20,height:20}} source={require("../assets/adaptive-icon.png")}/>,
            tabBarLabel:"Donate Books"
        }
    },
    ExchangeScreen:{screen:ExchangeScreen,
        navigationOptions:{
            tabBarIcon:<Image style={{width:20,height:20}} source={require("../assets/favicon.png")}/>,
            tabBarLabel:"Request Books"
        }
    }
})