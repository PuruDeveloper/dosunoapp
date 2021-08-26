import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./AccountDetails.css";
import db from "../../firebase";
import { actionTypes } from "../../Reducer";
import { useStateValue } from "../../StateProvider";

function AccountDetails({
  photoURL,
  id,
  uid,
  description,
  username,
  useremail,
  userpassword,
}) {
  const [{ user }, dispatch] = useStateValue();
  const [roominvites, setRoominvites] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  let usernameError = false;

  const deleteInvite = (e, inviteid, roomid) => {
    e.preventDefault();
    db.collection("roominvites").doc(inviteid).delete();
  };

  const acceptInvite = (e, inviteid, roomid) => {
    e.preventDefault();
    db.collection("roominvites").doc(inviteid).delete();
    db.collection("rooms").doc(roomid).collection("roommates").add({
      uid: uid,
      useremail: useremail,
    });

    {
      rooms.map(
        (room) =>
          room.id === roomid &&
          db
            .collection("rooms")
            .doc(roomid)
            .update({
              members: room.data.members + 1,
            })
      );
    }

    // db.collection("rooms")
    //   .doc(roomid)
    //   .update({
    //     members: roommembers + 1,
    //   });
  };

  const userExists = (newusername) => {
    let exists = 0;

    {
      users.map(
        (user) =>
          user.data.username === newusername &&
          ((exists = 1), alert("Username already exists"))
      );
    }
    console.log(exists);
    if (exists === 0) {
      updateRoomAdmin(newusername);
    }
  };

  const updateRoomAdmin = (newusername) => {
    {
      rooms.map(
        (room) =>
          room.data.chatadmin === username &&
          db
            .collection("rooms")
            .doc(room.id)
            .update({
              chatadmin: `${newusername}`,
            })
      );
    }
    db.collection("users")
      .doc(id)
      .update({
        username: `${newusername}`,
      });
    dispatch({
      type: actionTypes.SET_USER,
      user: "old",
      userName: `${newusername}`,
      userEmail: `${useremail}`,
      uid: `${uid}`,
      photoURL: `${photoURL}`,
    });
  };

  //To change description

  const changeDescription = (e) => {
    e.preventDefault();
    const newdescription = prompt("Please enter description");
    if (newdescription && newdescription.length <= 120) {
      db.collection("users").onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

      db.collection("users")
        .doc(id)
        .update({
          description: `${newdescription}`,
        });
    } else if (newdescription && newdescription.length > 120) {
      alert("You exceeded the limit of 120 characters");
    } else {
      alert("You need to enter something");
    }
  };

  //To change UserName

  const changeUsername = (e) => {
    e.preventDefault();
    const newusername = prompt("Please enter room name");
    if (newusername) {
      userExists(`${newusername}`);
    } else {
      alert("You need to put some username befor submitting man!");
    }
  };

  //To change Password

  const changePassword = (e) => {
    e.preventDefault();
    const newpassword = prompt("Please enter password");
    if (newpassword && newpassword.length >= 8) {
      db.collection("users").onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
      db.collection("users")
        .doc(id)
        .update({
          userpassword: `${newpassword}`,
        });
    } else if (newpassword && newpassword.length < 8) {
      alert("Your password should be atleast 8 characters strong");
    } else {
      alert("You need to enter something");
    }
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

    db.collection("roominvites").onSnapshot((snapshot) =>
      setRoominvites(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    const unsubscribe = db
      .collection("rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setRooms(
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

  return (
    <div className="accountdetails">
      <div className="accountdetails__left">
        <div className="user__details">
          <div class="user__image">
            <img src={photoURL} alt="my-image" />
          </div>
        </div>
        <div className="user__details">
          <div className="user__detail">
            <h4>About User</h4>
            <h2>{description}</h2>
          </div>
          <Button
            className="change__button"
            onClick={(e) => changeDescription(e)}
          >
            Change Description
          </Button>
        </div>

        <div className="user__details">
          <div className="user__detail">
            <h4>User Name :</h4>
            <h2>{username}</h2>
          </div>

          <Button className="change__button" onClick={(e) => changeUsername(e)}>
            Change UserName
          </Button>
        </div>

        <div className="user__details">
          <div className="user__detail">
            <h4>User Email :</h4>
            <h2>{useremail}</h2>
          </div>
        </div>
        <div className="user__details">
          <div className="user__detail">
            <h4>User Password :</h4>
            <h2>{userpassword}</h2>
          </div>
          <Button className="change__button" onClick={(e) => changePassword(e)}>
            Change Password
          </Button>
        </div>
      </div>
      <div className="accountdetails__right">
        <h1>Room Invites</h1>
        <div>
          {roominvites.map(
            (roominvite) =>
              roominvite.data.useremail === useremail && (
                <div className="roominvites">
                  <h4>{roominvite.data.roomname}</h4>
                  <div className="invitebuttons">
                    <Button
                      className="change__button"
                      onClick={(e) =>
                        deleteInvite(e, roominvite.id, roominvite.data.roomid)
                      }
                    >
                      Delete Invite
                    </Button>
                    <Button
                      className="change__button"
                      onClick={(e) =>
                        acceptInvite(e, roominvite.id, roominvite.data.roomid)
                      }
                    >
                      Accept Invite
                    </Button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
