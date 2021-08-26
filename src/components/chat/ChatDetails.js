import { Avatar, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import "./ChatDetails.css";
import { useStateValue } from "../../StateProvider";
import db from "../../firebase";

function ChatDetails() {
  const { seed } = useParams();
  const { roomId } = useParams();
  const { roomName } = useParams();
  const [{ userEmail, userName }, dispatch] = useStateValue();
  const history = useHistory();
  const [roomAdmin, setRoomAdmin] = useState("");
  let roomAdminPhoto = "";
  let roomAdminUid = "";
  let roomAdminId = "";
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [roominvites, setRoominvites] = useState([]);
  const [roommates, setRoommates] = useState([]);

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
    //Storing all the rooms data in rooms[]
    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    //Accepting the rooms admin email id in roomAdmin
    {
      rooms.map(
        (room, key = room.id) =>
          room.id === roomId && setRoomAdmin(room.data.chatadmin)
      );
    }
  }, []);

  const deleteRoom = (e) => {
    e.preventDefault();

    {
      rooms.map(
        (room, key = room.id) =>
          room.id === roomId &&
          room.data.chatadmin === userName &&
          db.collection("rooms").doc(roomId).delete() &&
          history.push(`/`)
      );
    }
  };

  const changeRoomName = (e) => {
    e.preventDefault();
    const newroomname = prompt("Enter new name");
    if (newroomname) {
      {
        roominvites.map(
          (roominvite) =>
            roominvite.data.roomid === `${roomId}` &&
            db
              .collection("roominvites")
              .doc(roominvite.id)
              .update({
                roomname: `${newroomname}`,
              })
        );
      }
      {
        rooms.map(
          (room) =>
            room.id === roomId &&
            db
              .collection("rooms")
              .doc(room.id)
              .update({
                name: `${newroomname}`,
              })
        );
      }
      history.push(`/rooms/${newroomname}/${seed}/${roomId}/details`);
    } else {
      alert("Invalid");
    }
  };

  const removeMember = (e, id) => {
    e.preventDefault();
    {
      rooms.map(
        (room) =>
          room.id === roomId &&
          room.data.chatadmin === userName &&
          db
            .collection("rooms")
            .doc(roomId)
            .collection("roommates")
            .doc(id)
            .delete() &&
          db
            .collection("rooms")
            .doc(room.id)
            .update({
              members: room.data.members - 1,
            })
      );
    }
  };
  return (
    <div className="chatdetails">
      <div className="chatdetails__header">
        <div className="chatdetails__header__1">
          <Link to={`/rooms/${roomName}/${seed}/${roomId}`}>
            <i class="fas fa-arrow-left"></i>
          </Link>
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <h3>{roomName}</h3>
        </div>

        <div>
          <Link to={`/rooms/${roomName}/${seed}/${roomId}/addmember`}>
            <Button className="chatdetails__header__2">Add Roommate</Button>
          </Link>
        </div>
      </div>
      <div className="chatdetails__body">
        <div className="chat__members">
          <p>Only admin can delete room or remove members</p>
          <h4>Room Members</h4>
          {rooms.map(
            (room, key = room.id) =>
              room.id === roomId && (
                <div className="roomadmin__line">
                  <p>{room.data.chatadmin}</p>
                  <i class="fas fa-user-shield">ADMIN</i>
                </div>
              )
          )}
          {roommates.map((roommate) => (
            <div>
              <p>{roommate.data.useremail}</p>

              <Button onClick={(e) => removeMember(e, roommate.id)}>
                Dismember
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="chatdetails__footer">
        <Button onClick={(e) => deleteRoom(e)}>Delete Room</Button>
        <Button onClick={(e) => changeRoomName(e)}>Change Room Name</Button>
      </div>
    </div>
  );
}

export default ChatDetails;
