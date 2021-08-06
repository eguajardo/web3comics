import "./App.css";
import { Switch, Route } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { useProfile } from "./hooks/useProfile";

import Profile from "./pages/Profile";
import Navbar from "./components/Layout/Navbar";
import { useEffect } from "react";

function App() {
  const { account, library } = useEthers();
  const { resetProfile } = useProfile();

  useEffect(() => {
    resetProfile();
  }, [account, library, resetProfile]);

  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
