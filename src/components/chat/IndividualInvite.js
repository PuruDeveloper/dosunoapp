import { Button, ButtonBase } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./IndividualInvite.css";
import db from "../../firebase";
import { useParams } from "react-router-dom";

function IndividualInvite({ userid, useremail, roomid, roomname, username }) {
  const [roominvites, setRoominvites] = useState([]);
  const { roomId } = useParams();
  let roommateExist = false;
  let roominviteExist = false;
  const [roommates, setRoommates] = useState([]);

  const userExist = (useremail) => {
    roommateExist = false;
    {
      roommates.map((roommate) => {
        if (roommate.data.useremail === useremail) {
          roommateExist = true;
        }
      });
    }

    return roommateExist;
  };

  const inviteExist = (useremail) => {
    roominviteExist = false;
    {
      roominvites.map((roominvite) => {
        if (
          roominvite.data.roomid === roomId &&
          roominvite.data.useremail === useremail
        ) {
          roominviteExist = true;
        }
      });
    }
    return roominviteExist;
  };
  const sendInvite = (e) => {
    e.preventDefault();
    db.collection("roominvites").add({
      roomid: roomid,
      roomname: roomname,
      userid: userid,
      useremail: useremail,
    });
    db.collection("roominvites").onSnapshot((snapshot) =>
      setRoominvites(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  };

  useEffect(() => {
    db.collection("rooms")
      .doc(roomId)
      .collection("roommates")
      .onSnapshot((snapshot) =>
        setRoommates(
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
  }, []);

  return (
    <div className="individualinvite">
      <div className="individual">
        <h3>{username}</h3>
        <button
          disabled={userExist(useremail) || inviteExist(useremail)}
          onClick={(e) => sendInvite(e, userid)}
        >
          SEND INVITE
        </button>
      </div>
    </div>
  );
}

export default IndividualInvite;
