import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem } from "react-native-elements";
import MYHeader from "../components/MYHeader";
export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      AllRequests: [],
    };
    this.requestRef = null;
  }

  getAllRequests = () => {
    this.requestRef = db
      .collection("exchange_requests")
      .onSnapshot((snapshot) => {
        var AllRequests = snapshot.docs.map((doc) => doc.data());
        this.setState({
          AllRequests: AllRequests,
        });
      });
  };

  componentDidMount() {
    this.getAllRequests();
  }
  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.item_Name}</ListItem.Title>
          <View style={styles.subtitleView}>
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {item.description}
            </ListItem.Subtitle>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("ReceiverDetails")
                this.props.navigation.navigate("ReceiverDetails", {
                  details: item,
                });
              }}
            >
              <Text style={{ color: "#ffff" }}>View</Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MYHeader title="Give Items" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.AllRequests.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requested Books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.AllRequests}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
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
