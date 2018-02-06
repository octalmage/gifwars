import * as firebase from 'firebase';

const config = {
   apiKey: "AIzaSyAt0hTdcyCTBur6xPMu4fWmXqkG25aGmx8",
   authDomain: "gif-war.firebaseapp.com",
   databaseURL: "https://gif-war.firebaseio.com",
   projectId: "gif-war",
   storageBucket: "gif-war.appspot.com",
   messagingSenderId: "344042236588"
 };

 firebase.initializeApp(config);

 export default firebase;
