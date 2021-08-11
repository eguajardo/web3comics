import "./App.css";
import { Switch, Route } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { useProfile } from "./hooks/useProfile";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import Navbar from "./components/Layout/Navbar";
import Profile from "./pages/Profile";
import Comics from "./pages/Comics";
import NewComic from "./pages/NewComic";
import ViewComic from "./pages/ViewComic";
import NewPublication from "./pages/NewPublication";
import ViewPublication from "./pages/ViewPublication";

function App() {
  const { account, library } = useEthers();
  const { resetProfile } = useProfile();

  useEffect(() => {
    resetProfile();
  }, [account, library, resetProfile]);

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <Navbar />
      <Switch>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/comic/new">
          <NewComic />
        </Route>
        <Route path="/comic/:publicationsStream/new">
          <NewPublication />
        </Route>
        <Route path="/comic/:publicationsStream/:index">
          <ViewPublication />
        </Route>
        <Route path="/comic/:publicationsStream">
          <ViewComic />
        </Route>
        <Route path="/:did">
          <Comics />
        </Route>
        <Route path="/">
          <Comics />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
