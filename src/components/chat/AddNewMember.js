import React, { useState, useEffect } from "react";
import "./AddNewMember.css";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import IndividualInvite from "./IndividualInvite";

function AddNewMember() {
  const { roomName } = useParams();
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [roominvites, setRoominvites] = useState([]);
  const filteredUsers = [];
  let filteredRoomInvites = [];

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
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
    <div className="addnewmember">
      <h1>Invite New Members</h1>
      <div className="invite__section">
        {rooms.map(
          (room) =>
            room.id === roomId &&
            room.data.members > 1 && (
              <ul>
                {users.map(
                  (user) =>
                    room.data.chatadmin !== user.data.useremail && (
                      <IndividualInvite
                        userid={user.id}
                        useremail={user.data.useremail}
                        roomid={room.id}
                        roomname={room.data.name}
                        username={user.data.username}
                      />
                    )
                )}
              </ul>
            )
        )}
      </div>

      <div className="invite__section">
        {rooms.map(
          (room) =>
            room.id === roomId &&
            room.data.members === 1 && (
              <ul>
                {users.map(
                  (user) =>
                    room.data.chatadmin !== user.data.useremail && (
                      <IndividualInvite
                        userid={user.id}
                        useremail={user.data.useremail}
                        roomid={room.id}
                        roomname={room.data.name}
                        username={user.data.username}
                      />
                    )
                )}
              </ul>
            )
        )}
      </div>
    </div>
  );
}

export default AddNewMember;
