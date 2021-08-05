import { useEthers, useConfig } from "@usedapp/core";
import { useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";

function AccountButton() {
  const { activateBrowserWallet, account, chainId } = useEthers();
  const { profile } = useProfile();
  const config = useConfig();

  console.log("Account:", account);
  console.log("config", config);
  console.log("chainId", chainId);

  // const supportedChain = config.supportedChains.includes(chainId);
  // TODO: Get supported chain from deployed contracts
  const supportedChain = true;
  console.log("supportedChain", supportedChain);

  useEffect(() => {
    console.log("profile from button", profile);
  }, [profile]);

  return (
    <div>
      {!account && supportedChain && (
        <button
          className="btn btn-outline-info nav-item nav-link px-4 ml-2"
          onClick={activateBrowserWallet}
        >
          Login
        </button>
      )}
      {!supportedChain && (
        <button className="alert alert-danger nav-item px-4 ml-2" disabled>
          Unsupported chain
        </button>
      )}
    </div>
  );
}

export default AccountButton;
