import React from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import firebase from "firebase";
import db from "../config";
import { Card, Header, Icon } from "react-native-elements";
export default class ReceiverDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam("details")["username"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      ItemName: this.props.navigation.getParam("details")["item_Name"],
      itemCurrencyCode:this.props.navigation.getParam("details")["currencyCode"],
        description: this.props.navigation.getParam("details")[
        "description"
      ],
      itemCost:this.props.navigation.getParam("details")["cost"],
      receiverName: "",
      receiverPhoneNumber: "",
      receiverAddress: "",
      changedItemCurrencyCode:'',
      userName : "",

    };
  }
addNotification=()=>{
  var message = this.state.userName + " Has shown interest in giving the item...";
  db.collection("all_notification").add({
    "targeted_username":this.state.receiverId,
    "donor_id":this.state.userId,
    "item_Name":this.state.ItemName,
    "request_id":this.state.requestId,
    "date":firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status":"unread",
    "message":message,
  })
}
getUserDetails=()=>{
  db.collection("users")
  .where("email", "==", this.state.userId)
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      this.setState({
        userName: doc.data().name + " " + doc.data().last_name
      });
    });
  });
}
  getReceiverDetails = () => {
    db.collection("users")
      .where("email", "==", this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().name,
            receiverPhoneNumber: doc.data().phone_number,
            receiverAddress: doc.data().address,
          });
        });
      });
  };
  updateItemStatus = () => {
    db.collection("all_donation").add({
      "item_Name": this.state.ItemName,
      "requested_by": this.state.receiverName,
      "donor_id": this.state.userId,
      "request_status": "Donor Interested",
      "request_id": this.state.requestId
    });
  };
  getData(){
    db.collection("users").where(this.state.userId,"==","email").get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          changedItemCurrencyCode:doc.data().currencyCode
        })
      })
    })
    fetch("http://data.fixer.io/api/latest?access_key=2ddcf7578c322acfc42865bdf82955a8&format=1")
    .then(response=>{
      return response.json();
    })
    .then(responseData=>{
      var currencyCode = this.state.itemCurrencyCode;
      var changedItemCurrencyCode = this.state.changedItemCurrencyCode;
      var currencyRate = responseData.rates.EUR;
      var value = this.state.itemCost/currencyRate;
      var changeValue = value * responseData.rates.changedItemCurrencyCode
      console.log(currencyCode + " " + this.state.itemCost);
      console.log(value + " " + currencyCode);
      console.log(changeValue + " " + changedItemCurrencyCode);
      console.log(this.state.changedItemCurrencyCode + 'currencyCode')
      console.log(currencyRate + " Rate Conversion")
    })
  }
  componentDidMount = () => {
    this.getReceiverDetails();
    this.getUserDetails();
    this.getData();
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                centerComponent={{
                  text: "Donate Items",
                  style: { color: "90A5A9", fontSize: 20, fontWeight: "bold" },
                }}
                backgroundColor="#eaf8fe"
              />
            }
          />
        </View>
        <View style={{ flex: 0.3 }}>
        <Card>
          <Card.Title>{"Item Information"}</Card.Title>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Item Name: {this.state.ItemName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.description}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                {this.getData()}
                Cost : {this.state.itemCurrencyCode + this.state.itemCost}
              </Text>
            </Card>
          </Card>
        </View>
        
        <View style={{ flex: 0.3 }}>
          
          <Card>
          <Card.Title>{"Receiver Information"}</Card.Title>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverPhoneNumber}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addNotification();
                this.updateItemStatus();
                this.props.navigation.navigate("MyDonation");
              }}
            >
              <Text>I want to give!</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})