import { useEthers, useConfig } from "@usedapp/core";
import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";

import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";

import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";

function AccountButton() {
  const { activateBrowserWallet, account, chainId, library } = useEthers();
  const config = useConfig();

  console.log("Account:", account);
  console.log("config", config);
  console.log("chainId", chainId);

  // const supportedChain = config.supportedChains.includes(chainId);
  // TODO: Get supported chain from deployed contracts
  const supportedChain = true;
  console.log("supportedChain", supportedChain);

  const connect = async () => {
    // activateBrowserWallet();

    if (library && account) {
      const ceramic = new Ceramic("https://ceramic-clay.3boxlabs.com");
      const idx = new IDX({ ceramic });

      const threeIdConnect = new ThreeIdConnect();
      console.log("library", library);
      console.log("account:", account);
      console.log("window.ethereum", window.ethereum);

      const authProvider = new EthereumAuthProvider(library.provider, account);
      await threeIdConnect.connect(authProvider);

      const provider = await threeIdConnect.getDidProvider();

      const resolver = {
        ...KeyDidResolver.getResolver(),
        ...ThreeIdResolver.getResolver(ceramic),
      };
      const did = new DID({ resolver });
      ceramic.did = did;

      ceramic.did.setProvider(provider);
      await ceramic.did.authenticate();

      const profile = await idx.get("basicProfile");
      console.log("profile", profile);
    }
  };

  connect();

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
