import React, { useState, useEffect } from "react";
import { useStateValue } from "../../StateProvider";
import "./Account.css";
import { Button } from "@material-ui/core";
import { Link, useParams, useHistory } from "react-router-dom";
import db from "../../firebase";
import AccountDetails from "./AccountDetails";
import { actionTypes } from "../../Reducer";

function Account() {
  const [{ userEmail, userName, uid, photoURL }, dispatch] = useStateValue();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  let username = "";
  let useremail = "";
  let userpassword = "";

  const logout = (e) => {
    e.preventDefault();
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
      userName: null,
      userEmail: null,
      uid: null,
      photoURL: null,
    });
    history.push(`/`);
  };

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    {
      users.map((user) => {
        for (let i = 0; i < users.length; i++) {
          if (user.data.useremail === userEmail) {
            username = user.data.username;
            useremail = user.data.useremail;
            userpassword = user.data.userpassword;
          }
          break;
        }
      });
    }
  }, []);
  return (
    <div class="account">
      <Link to="/">
        <i class="fas fa-arrow-left"></i>
      </Link>

      <Button className="logout" onClick={(e) => logout(e)}>
        LOG OUT
      </Button>

      <div>
        {users.map(
          (user) =>
            user.data.useremail === userEmail && (
              <AccountDetails
                photoURL={user.data.userphoto}
                id={user.id}
                uid={user.data.uid}
                description={user.data.description}
                username={user.data.username}
                useremail={user.data.useremail}
                userpassword={user.data.userpassword}
              />
            )
        )}
      </div>
    </div>
  );
}

export default Account;
