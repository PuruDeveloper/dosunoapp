import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Chat.css";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import MoreVert from "@material-ui/icons/MoreVert";
import db from "../../firebase";
import firebase from "firebase";
import { useStateValue } from "../../StateProvider";
import NotFoundPage from "../NotFoundPage";

function Chat() {
  const [{ userName, userEmail }, dispatch] = useStateValue();
  const { seed } = useParams();
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const { roomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roommates, setRoommates] = useState([]);

  useEffect(() => {
    // setSeed(Math.floor(Math.random() * 5000));
    db.collection("rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    //Storing roommates details
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

    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: userName,
      email: userEmail,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //Updating the timestamp of the room with the timestamp of the latest message
    db.collection("rooms").doc(roomId).update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  return (
    <div className="chat">
      {rooms.map(
        (room) =>
          (room.id === roomId && room.data.chatadmin === userName && (
            <div className="chat">
              <div className="chat__header">
                <Link to="/">
                  <i class="fas fa-arrow-left"></i>
                </Link>
                <Avatar
                  src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
                />
                <div className="chat__headerInfo">
                  <h3>{roomName}</h3>
                  {/* <p>
            Last seen at ...
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p> */}
                </div>

                <div className="chat__headerRight">
                  <Button>
                    <Link to={`/rooms/${roomName}/${seed}/${roomId}/details`}>
                      Room Details
                    </Link>
                  </Button>
                  {/* <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton> */}
                </div>
              </div>
              <div className="chat__body">
                {messages.map((message, key = message.id) => (
                  <p
                    className={
                      message.email === userEmail
                        ? "chat__reciever"
                        : "chat__message"
                    }
                  >
                    <span className="chat__name">{message.name}</span>
                    {message.message}
                    <span className="chat__timestamp">
                      {new Date(message.timestamp?.toDate()).toUTCString()}
                    </span>
                  </p>
                ))}
              </div>
              <div className="chat__footer">
                <InsertEmoticonIcon />
                <form type="submit">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    type="text"
                  />
                  <button onClick={sendMessage} type="submit">
                    Send a message
                  </button>
                </form>
                <MicIcon />
              </div>
            </div>
          )) ||
          roommates.map(
            (roommate) =>
              room.id === roomId &&
              roommate.data.useremail === userEmail && (
                <div className="chat">
                  <div className="chat__header">
                    <Link to="/">
                      <i class="fas fa-arrow-left"></i>
                    </Link>
                    <Avatar
                      src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
                    />
                    <div className="chat__headerInfo">
                      <h3>{roomName}</h3>
                      {/* <p>
            Last seen at ...
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p> */}
                    </div>

                    <div className="chat__headerRight">
                      <Button>
                        <Link
                          to={`/rooms/${roomName}/${seed}/${roomId}/details`}
                        >
                          Room Details
                        </Link>
                      </Button>
                      {/* <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton> */}
                    </div>
                  </div>
                  <div className="chat__body">
                    {messages.map((message, key = message.id) => (
                      <p
                        className={
                          message.email === userEmail
                            ? "chat__reciever"
                            : "chat__message"
                        }
                      >
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                          {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                      </p>
                    ))}
                  </div>
                  <div className="chat__footer">
                    <InsertEmoticonIcon />
                    <form type="submit">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        type="text"
                      />
                      <button onClick={sendMessage} type="submit">
                        Send a message
                      </button>
                    </form>
                    <MicIcon />
                  </div>
                </div>
              )
          ) || <NotFoundPage />
      )}
    </div>
  );
}

export default Chat;
