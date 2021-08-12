import { toGatewayURL } from "nft.storage";
import { newIdx } from "../../helpers/ceramic";

import { useEthers } from "@usedapp/core";
import { useProfile } from "../../hooks/useProfile";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

function AccountButton() {
  const { activateBrowserWallet, account, library } = useEthers();
  const { profile, setProfile } = useProfile();
  const routerHistory = useHistory();

  const connect = async () => {
    if (!account) {
      activateBrowserWallet();
    }

    if (account && library && library.provider) {
      const idx = await newIdx(library.provider, account);
      const idXProfile = await idx.get("basicProfile");
      console.log("idXProfile", idXProfile);

      setProfile(idx, idXProfile);
      if (!idXProfile || !idXProfile.name || !idXProfile.image) {
        console.log("redirecting...");
        routerHistory.push("/profile");
        return <></>;
      }
    }
  };

  return (
    <div>
      {!profile && (
        <button
          className="btn btn-outline-info nav-item nav-link px-4 ml-2"
          onClick={connect}
        >
          Login
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
