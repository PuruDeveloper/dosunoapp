import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, Button, IconButton } from "@material-ui/core";
import DonutLagreIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db from "../firebase";
import { useParams, Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import SidebarMember from "./SidebarMember";

function Sidebar() {
  const [{ user, userEmail, uid, userName, photoURL }, dispatch] =
    useStateValue();

  const [rooms, setRooms] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    // const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
    //   setRooms(
    //     snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       data: doc.data(),
    //     }))
    //   )
    // );
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
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={photoURL} alt="" />

        <div className="sidebar__headerRight">
          <Link to={`/user/${userEmail}`}>
            <Button>
              My Account <i class="fas fa-cog"></i>
            </Button>
          </Link>
          {/* <IconButton>
            <DonutLagreIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton> */}
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map(
          (room) =>
            (room.data.chatadmin === userName && (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            )) || <SidebarMember id={room.id} name={room.data.name} />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
