import firebase from "firebase";
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyAOJmRHL_KWX1hYWm_H45mNYyOJ0z_dTfE",
    authDomain: "bartersystemapp-54a47.firebaseapp.com",
    projectId: "bartersystemapp-54a47",
    storageBucket: "bartersystemapp-54a47.appspot.com",
    messagingSenderId: "393345635881",
    appId: "1:393345635881:web:c445080d69c0f07ff46e38"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();
