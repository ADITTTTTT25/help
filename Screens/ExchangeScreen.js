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
import MYHeader from "../components/MYHeader";
export default class ExchangeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      description: "",
      userName: firebase.auth().currentUser.email,
      isItemRequestActive:false,
      userDocId:"",
      itemStatus:'',
      requestedItemName:'',
      docId:'',
      userDocId:'',
      requestId:'', 
      cost:'',
      itemCost:'',
      currencyCode:this.props.navigation.getParam("currency")
    };
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
     
  addItem = async(itemName, description,cost) => {
    var userName = this.state.userName;
    var randomRequestId = this.createUniqueId();
    db.collection("exchange_requests").add({
      "username": userName,
      "item_Name": itemName,
      "description": description,
      "cost":cost,
      "currencyCode":this.state.currencyCode,
      "item_status":"requested",
      "request_id": randomRequestId,
    });
    this.setState({
      itemName: "",
      description: "",
      cost:'',
    });
    this.getItemRequest();
    db.collection("users").where("email","==",userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
      "isItemRequestActive": true
      })
    })                                                    
  });                                                                                                                                                                                                                                                    
   
    return Alert.alert("Item ready to exchange", "", [
      {
        text: "Ok",
        onPress: () => {
          this.props.navigation.navigate("HomeScreen",{"currency":this.state.currencyCode});
          console.log(this.state.currencyCode);
        },
      },
    ]);
  };
 
  getIsItemRequestActive=()=>{
    db.collection("users").where("email","==",this.state.userName).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          isItemRequestActive: doc.data().isItemRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  getItemRequest=()=>{
    db.collection("exchange_requests").where("username","==",this.state.userName).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().item_status != "received"){
          this.setState({
            requestedItemName:doc.data().item_Name,
            itemStatus:doc.data().item_status,
            itemCost:doc.data().cost,
            currencyCode:data().currencyCode,
            docId: doc.id,
            requestId:doc.data().request_id,
            itemCost:doc.data().cost
          })
        }
      })
    });
  }

  sendNotification=()=>{
    db.collection("users").where("email","==",this.state.userName).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().name
        var lastname = doc.data().last_name
        db.collection("all_notification").where("request_id","==",this.state.requestId).get().then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorId = doc.data().donor_id
            var itemName =  doc.data().item_Name
            db.collection("all_notification").add({
              "target_username":donorId,
              "message":  name + " " + lastname + " received the item " + itemName,
              "notification_status":"unread",
              "item_name":itemName
            })
          })
        })
      })
    })
  }

  updateItemRequestStatus=()=>{
    db.collection("exchange_requests").doc(this.state.docId).update({
      "item_status":"received"
    })

    db.collection("users").doc(this.state.userDocId).update({
      "isItemRequestActive":false
    })


  }

  receiveItems=(itemName)=>{
    var userName = this.state.userName
    var requestId = this.state.requestId
    db.collection('received_items').add({
      "user_id":userName,
      "item_Name":itemName,
      "itemCost":itemCost,
      "itemCurrencyCode":currencyCode,
      "request_id":requestId,
      "itemStatus":"received"
    })
  }


   componentDidMount(){
    this.getIsItemRequestActive();
    this.getItemRequest();
  }
  render() {
    if(this.state.isItemRequestActive === true){
      return (
        <View style={{flex:1,justifyContent:"center"}}>
          <View style={{borderColor:"green",borderWidth:2,justifyContent:"center", alignItems:'center',padding:10,margin:10}}>
            <Text>Item Name:</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{borderColor:"green",borderWidth:2,justifyContent:"center", alignItems:'center',padding:10,margin:10}}>
            <Text>Item Status:</Text>
            <Text>{this.state.itemStatus}</Text>
          </View>
          <View style={{borderColor:"green",borderWidth:2,justifyContent:"center", alignItems:'center',padding:10,margin:10}}>
            <Text>Item Cost:</Text>
            <Text>{this.state.itemCost}</Text>
          </View>
          <TouchableOpacity style={{borderWidth:1,borderColor:'green',backgroundColor:"green",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}} onPress={
            ()=>{
              this.sendNotification()
              this.updateItemRequestStatus()
              this.receiveItems(this.state.itemName)
            }
          }>
            <Text>
              I have received the item!
            </Text>
          </TouchableOpacity>
        </View>
      )
    }else{
    return (
      <View style={{ flex: 1 }}>
        <MYHeader title="Exchange" navigation={this.props.navigation}/>
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Enter Item Name..."}
            onChangeText={(text) => {
              this.setState({
                itemName: text,
              });
            }}
            value={this.state.itemName}
          />
          <TextInput
            style={[styles.formTextInput, { height: 300 }]}
            placeholder={"Why Do You Need The Item?"}
            multiline={true}
            numberOfLines={8}
            onChangeText={(text) => {
              this.setState({
                description: text,
              });
            }}
            value={this.state.description}
          />
           <TextInput
            style={styles.formTextInput}
            placeholder={"Cost"}
            onChangeText={(text) => {
              this.setState({
                cost: text,
              });
            }}
            value={this.state.cost}
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => {
              this.addItem(this.state.itemName, this.state.description , this.state.cost);
            }}
          >
            <Text style={{ color: "#ffff", fontSize: 18, fontWeight: "bold" }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
          }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
});
