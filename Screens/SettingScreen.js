import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import MYHeader from "../components/MYHeader";
import firebase from "firebase";
import db from "../config";
export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      email: firebase.auth().currentUser.email,
      documentID: "",
    };
  }
  getUserDetails = () => {
    db.collection("users")
      .where("email", "==", this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var userData = doc.data();

          this.setState({
            firstName: userData.name,
            lastName: userData.last_name,
            phoneNumber: userData.phone_number,
            address: userData.address,
            email: userData.email,
            documentID: doc.id,
          });
        });
      });
  };
  updateUserDetails = () => {
    db.collection("users")
      .doc(this.state.documentID)
      .update({
        name: this.state.firstName,
        last_name: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
      })
      .then(() => {
        Alert.alert("Updated Succesfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.12 }}>
          <MYHeader title="Settings" />
        </View>

        <View style={styles.formContainer}>
          <View style={{ flex: 0.66, padding: 10 }}>
            <Text style={styles.label}> First Name</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="First Name"
              maxLength={12}
              onChangeText={(text) => {
                this.setState({
                  firstName: text,
                });
              }}
              value={this.state.firstName}
            />
            <Text style={styles.label}> Last Name</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="Last Name"
              maxLength={12}
              onChangeText={(text) => {
                this.setState({
                  lastName: text,
                });
              }}
              value={this.state.lastName}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="Phone Number"
              keyboardType={"numeric"}
              maxLength={10}
              onChangeText={(text) => {
                this.setState({
                  phoneNumber: text,
                });
              }}
              value={this.state.phoneNumber}
            />
            <Text style={styles.label}> Address</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="Address"
              multiline={true}
              onChangeText={(text) => {
                this.setState({
                  address: text,
                });
              }}
              value={this.state.address}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateUserDetails();
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 0.88,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "#717D7E",
    fontWeight: "bold",
    padding: 10,
    marginLeft: 20,
  },
  formTextInput: {
    width: "90%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "grey",
    marginBottom: 20,
    marginLeft: 20,
  },
  button: {
    width: "75%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
  buttonView: {
    flex: 0.22,
    alignItems: "center",
    marginTop: 100,
  },
  buttonText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },
});
