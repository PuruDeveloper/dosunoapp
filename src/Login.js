import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import { actionTypes } from "./Reducer";
import { useStateValue } from "./StateProvider";
import db from "./firebase";

function Login({ testValue }) {
  const [{ user, userName, userEmail, test }, dispatch] = useStateValue();
  let userPassword = "";
  const [users, setUsers] = useState([]);
  let photoURL = "";
  let uid = "";
  let username = "";
  let useremail = "";

  let [manualUsername, setManualUsername] = useState("");
  let [manualPassword, setManualPassword] = useState("");

  const changeUsername = (e) => {
    e.preventDefault();
    setManualUsername(`${e.target.value}`);
  };

  const changePassword = (e) => {
    e.preventDefault();
    setManualPassword(`${e.target.value}`);
  };

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const manualSignIn = (e) => {
    e.preventDefault();
    db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    testValue = 0;
    console.log(manualPassword);
    {
      users.map(
        (user) =>
          user.data.username === manualUsername &&
          user.data.userpassword === manualPassword &&
          (((testValue = 1), (username = user.data.username)),
          (useremail = user.data.useremail),
          (uid = user.data.uid),
          (photoURL = user.data.userphoto),
          alert("We are glad you came back"),
          dispatch({
            type: actionTypes.SET_USER,
            user: "new",
            userName: `${username}`,
            userEmail: `${useremail}`,
            uid: `${uid}`,
            photoURL: `${photoURL}`,
          }))
      );
    }
    if (testValue !== 1) {
      alert("Username or Password is incorrect");
    }
  };

  async function googleSignUp() {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // console.log(result.user.uid);

        userPassword = Math.floor(Math.random() * 10000000);
        // setTimeout(() => {}, 5000);
        //If the user is already registered then we take his username and useremail and uid from the database because he can edit those.
        let check = 0;
        let i = 0;
        {
          users.map((user) => {
            i++;
            if (user.data.uid === result.user.uid) {
              check = 1;
              testValue = 1;
              username = user.data.username;
              useremail = user.data.useremail;
              uid = user.data.uid;
              photoURL = user.data.userphoto;
              alert("We are glad you came back");
              dispatch({
                type: actionTypes.SET_USER,
                user: "old",
                userName: `${username}`,
                userEmail: `${useremail}`,
                uid: `${uid}`,
                photoURL: `${photoURL}`,
              });
            }
          });
          if (check === 0) {
            db.collection("users").add({
              description: "Hey there I am using ChatsApp",
              uid: `${result.user.uid}`,
              useremail: `${result.user.email}`,
              username: `${result.user.email}`,
              userpassword: `${userPassword}`,
              userphoto: `${result.user?.photoURL}`,
            });

            //Dispatching action so that application knows user has logged in
            dispatch({
              type: actionTypes.SET_USER,
              user: "new",
              userName: `${result.user.displayName}`,
              userEmail: `${result.user.email}`,
              uid: `${result.user.uid}`,
              photoURL: `${result.user.photoURL}`,
            });
            alert("Welcome to the chatsapp");
          }
        }
      })
      .catch((error) => alert(error.message));
  }
  return (
    <div className="login">
      <div className="login__container">
        <div className="login__text">
          <h1>dosUNO</h1>
        </div>
        <div className="welcome__text">
          <p>Welcome to dosUNO</p>
        </div>
        <form className="form" type="submit">
          <label>Username</label>
          <input
            value={manualUsername}
            onChange={(e) => changeUsername(e)}
            placeholder="Username"
            type="text"
          ></input>
          <label>Password</label>
          <input
            value={manualPassword}
            onChange={(e) => changePassword(e)}
            placeholder="Password"
            type="text"
          ></input>

          <Button type="submit" onClick={(e) => manualSignIn(e)}>
            LogIn
          </Button>
        </form>

        <p>or</p>
        <Button onClick={googleSignUp}>Sign In With Google</Button>
        {/* <Button>Sign In Manually</Button> */}
      </div>
    </div>
  );
}

export default Login;
