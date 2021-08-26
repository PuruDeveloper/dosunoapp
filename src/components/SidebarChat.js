import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "../firebase";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";

function SidebarChat({ addNewChat, id, name }) {
  const [{ user, userEmail, uid, userName }, dispatch] = useStateValue();
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roommates, setRoommates] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
    setSeed(Math.floor(Math.random() * 5000));
    db.collection("rooms")
      .doc(roomId)
      .collection("roommates")
      .onSnapshot((snapshot) =>
        setRoommates(snapshot.docs.map((doc) => doc.data()))
      );

    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  // useEffect(() => {
  //   const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
  //     setUsers(
  //       snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }))
  //     )
  //   );
  // }, []);

  // useEffect(() => {
  //   setSeed(Math.floor(Math.random() * 5000));
  //   db.collection("rooms")
  //     .doc(roomId)
  //     .collection("roommates")
  //     .onSnapshot((snapshot) =>
  //       setRoommates(snapshot.docs.map((doc) => doc.data()))
  //     );

  //   db.collection("rooms").onSnapshot((snapshot) =>
  //     setRooms(
  //       snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }))
  //     )
  //   );
  // }, []);

  const createChat = () => {
    const roomName = prompt("Please enter room name");

    if (roomName) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      db.collection("rooms").add({
        name: roomName,
        timestamp: timestamp,
        chatadmin: userName,
        members: 1,
      });

      // db.collection("rooms").onSnapshot((snapshot) =>
      //   setRooms(
      //     snapshot.docs.map((doc) => ({
      //       id: doc.id,
      //       data: doc.data(),
      //     }))
      //   )
      // );

      //Updating names of roommates in the group that is created just now by the value of chatadmin
      // {
      //   rooms.map(
      //     (room) =>
      //       room.data.chatadmin === userEmail &&
      //       room.data.timestamp === timestamp &&
      //       console.log("hey")
      //     // db.collection("rooms").doc(room.id).collection("roommates").add({
      //     //   useremail: userEmail,
      //     //   uid: uid,
      //     // })
      //   );
      // }
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${name}/${seed}/${id}`}>
      <div className="sidebarChat">
        <div>
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        </div>
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat addNewChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
