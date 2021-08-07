import { useEthers } from "@usedapp/core";
import { useProfile } from "../../hooks/useProfile";
import { newIdx } from "../../helpers/ceramic";
import { useHistory } from "react-router-dom";

function LoginButton() {
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
    </div>
  );
}

export default LoginButton;
