import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MYHeader from "../components/MYHeader.js";
import firebase from "firebase";
import db from "../config";
import SwipeableFlatlist from "../components/SwipeableFlatlist"
export default class NotificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }
  getNotifications = () => {
    this.requestRef = db
      .collection("all_notification")
      .where("notification_status", "==", "unread")
      .where("targeted_username", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });

        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.item_Name}</ListItem.Title>
          <View style={styles.subtitleView}> 
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {item.message}
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };
  render() {
    return (
      <View style={styles.view}>
        <MYHeader title="My Notifications" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>
               You have no notifications
              </Text>
            </View>
          ) : (
            <SwipeableFlatlist
            allNotifications = {this.state.allNotifications}
             />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  button: {
    flex: 0.2,
    width: 100,
    height: 30,
    alignSelf: "end",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  subtitleView: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
