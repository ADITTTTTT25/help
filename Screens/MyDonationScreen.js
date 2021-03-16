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
export default class MyDonationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      donorId: firebase.auth().currentUser.email,
      allDonations: [],
      userId: firebase.auth().currentUser.email,
      donorName: "",
    };
    this.requestRef = null;
  }
  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donation")
      .where("donor_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonations.push(donation);
        });

        this.setState({
          allDonations: allDonations,
        });
      });
  };
  sendItem = (ItemDetails) => {
    if (ItemDetails.request_status === "Item Sent") {
      var requestStatus = "Donor Interested";
      db.collection("all_donation").doc(ItemDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(ItemDetails, requestStatus);
    } else {
      var requestStatus = "Item Sent";
      db.collection("all_donation").doc(ItemDetails.doc_id).update({
        request_status: "Item Sent",
      });
      this.sendNotification(ItemDetails, requestStatus);
    }
  };

  getDonorDetails = (donorId) => {
    db.collection("users")
      .where("email", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().name + " " + doc.data().last_name,
          });
        });
      });
  };
  sendNotification = (ItemDetails, requestStatus) => {
    var exchangeId = ItemDetails.request_id;
    var donorId = ItemDetails.donor_id;
    db.collection("all_notification")
      .where("donor_id", "==", donorId)
      .where("request_id","==",exchangeId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus == "Item Sent") {
            message = this.state.donorName + " Has sent the Item to you!";
          } else {
            message =
              this.state.donorName + " Has shown interest in donating the Item!";
          }
          db.collection("all_notfication").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };
  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.donorId);
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.Item_name}</ListItem.Title>

          <View style={styles.subtitleView}>
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {"Requested By : " +
                item.requested_by +
                "\nStatus : " +
                item.request_status}
            </ListItem.Subtitle>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    item.request_status === "Item Sent" ? "green" : "#ff5722",
                },
              ]}
              onPress={() => {
                this.sendItem(item);
              }}
            >
              <Text style={{ color: "#ffff" }}>
                {item.request_status === "Item Sent"
                  ? "Item Sent"
                  : "Send Item"}
              </Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };
  render() {
    return (
      <View style={styles.view}>
        <MYHeader title="My Donations" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Item Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
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
