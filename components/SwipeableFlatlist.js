import React from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { ListItem } from "react-native-elements";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import { Dimensions } from "react-native";

export default class SwipeableFlatlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }
  onSwipeValueChange = (swipeData) => {
    var allNotification = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotification];
      this.updateMarkAsRead(allNotification[key]);
      newData.splice(key, 1);
      this.setState({
        allNotifications: newData,
      });
    }
  };
  renderItem = (data) => (
    <Animated.View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{data.item.book_name}</ListItem.Title>
          <View style={styles.subtitleView}>
            <Icon name="book" type="font-awesome" color="#696969" />
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {data.item.message}
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem>
    </Animated.View>
  );
  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Mark As Read</Text>
      </View>
    </View>
  );
  updateMarkAsRead = (notification) => {
    db.collection("all_notification").doc(notification.doc_id).update({
      notification_status: "read",
    });
  };
  render() {
    return (
      <View>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          onSwipeValueChange={this.onSwipeValueChange}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          keyExtractor={(item, index) => index.toString()}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subtitleView: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#29b6f6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: "#29b6f6",
    right: 0,
  },
});
