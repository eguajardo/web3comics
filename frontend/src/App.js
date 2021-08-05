import "./App.css";
import { Switch, Route } from "react-router-dom";
import { newIdx } from "./helpers/ceramic";
import { useEthers } from "@usedapp/core";
import { useProfile } from "./hooks/useProfile";

import Profile from "./pages/Profile";
import Navbar from "./components/Layout/Navbar";
import { useEffect } from "react";

function App() {
  const { account, library } = useEthers();
  const { setProfile } = useProfile();

  useEffect(() => {
    const updateProfile = async () => {
      if (account && library && library.provider) {
        const idx = await newIdx(library.provider, account);

        let profile = await idx.get("basicProfile");
        if (!profile) {
          profile = {};
        }
        console.log("profile from App", profile);
        profile.did = idx.id;
        profile.name = "test name";
        setProfile(idx, profile);
      }
    };
    updateProfile();
  }, [account, library, setProfile]);

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
