import "./App.css";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/chat/Chat";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import Account from "./components/account/Account";
import ChatDetails from "./components/chat/ChatDetails";
import NotFoundPage from "./components/NotFoundPage";
import AddNewMember from "./components/chat/AddNewMember";

function App() {
  const [{ user, userEmail, userName }, dispatch] = useStateValue();
  return (
    //BEM naming convention
    <div className="app">
      {!userEmail ? (
        <Login testValue={0} />
      ) : (
        <div className="app__body">
          <Router>
            <Switch>
              <Route exact path="/">
                <Sidebar />
              </Route>
              <Route exact path="/user/:userEmail">
                <Account />
              </Route>
              <Route exact path="/rooms/:roomName/:seed/:roomId">
                <Chat />
              </Route>
              <Route exact path="/rooms/:roomName/:seed/:roomId/details">
                <ChatDetails />
              </Route>
              <Route exact path="/rooms/:roomName/:seed/:roomId/addmember">
                <AddNewMember />
              </Route>
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </Router>
          {/* Chat */}
        </div>
      )}
    </div>
  );
}

export default App;
