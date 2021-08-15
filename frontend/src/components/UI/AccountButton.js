import { toGatewayURL } from "nft.storage";
import { newIdx } from "../../helpers/ceramic";

import { useEthers } from "@usedapp/core";
import { useProfile } from "../../hooks/useProfile";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import LoadingDots from "./LoadingDots";

function AccountButton() {
  const { activateBrowserWallet, account, library } = useEthers();
  const { profile, setProfile } = useProfile();
  const routerHistory = useHistory();
  const [idx, setIdx] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectToProfile = useCallback(() => {
    console.log("redirecting to profile?", profile);
    if (shouldRedirect && (!profile || !profile.name || !profile.image)) {
      console.log("redirecting...");
      routerHistory.push("/profile");
      setShouldRedirect(false);
      return <></>;
    }
  }, [profile, routerHistory, shouldRedirect]);

  const loadProfile = useCallback(async () => {
    if (idx && idx.id) {
      const idXProfile = await idx.get("basicProfile");
      console.log("idXProfile", idXProfile);

      await setProfile(idx, idXProfile);
      setLoading(false);
      setShouldRedirect(true);
    }
  }, [idx, setProfile]);

  const authenticateWithIDX = useCallback(async () => {
    if (account && library && library.provider) {
      setLoading(true);
      setIdx(await newIdx(library.provider, account));
    }
  }, [account, library]);

  useEffect(() => {
    authenticateWithIDX();
  }, [authenticateWithIDX]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    redirectToProfile();
  }, [redirectToProfile]);

  const connect = async () => {
    if (!account) {
      activateBrowserWallet();
    }
  };

  return (
    <div>
      {!profile && (
        <button
          className="btn btn-outline-info nav-item nav-link px-4 ml-2"
          onClick={connect}
        >
          {!loading && "Login"}
          {loading && <LoadingDots />}
        </button>
      )}
      {profile && (
        <NavLink
          id="new-link"
          className="nav-item nav-link"
          activeClassName="active"
          to="/profile"
        >
          <span className="mr-2">{profile.name}</span>
          <span>
            <img
              className="img-fluid profile-picture-thumbnail"
              alt={profile.name}
              src={toGatewayURL(profile.image.original.src)}
            />
          </span>
        </NavLink>
      )}
    </div>
  );
}

export default AccountButton;
