import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfgPYh2oFAo240lXvTruumntLq6jMFmLM",
  authDomain: "dosunoapp-4dbb5.firebaseapp.com",
  projectId: "dosunoapp-4dbb5",
  storageBucket: "dosunoapp-4dbb5.appspot.com",
  messagingSenderId: "939380681541",
  appId: "1:939380681541:web:623354b7b55ddfe65c6c2c",
  measurementId: "G-2933TMCC75",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
