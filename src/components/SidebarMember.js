import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import SidebarChat from "./SidebarChat";
import db from "../firebase";

function SidebarMember({ id, name }) {
  const [roommates, setRoommates] = useState([]);
  const [{ userEmail }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection("rooms")
      .doc(id)
      .collection("roommates")
      .onSnapshot((snapshot) =>
        setRoommates(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);
  return (
    <div>
      {roommates.map(
        (roommate) =>
          roommate.data.useremail === userEmail && (
            <SidebarChat key={id} id={id} name={name} />
          )
      )}
    </div>
  );
}

export default SidebarMember;
