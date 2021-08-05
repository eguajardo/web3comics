import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";

import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";

import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";

export async function newIdx(provider, address) {
  const ceramic = new Ceramic("http://localhost:7007");

  const threeIdConnect = new ThreeIdConnect();
  console.log("provider", provider);
  console.log("account:", address);
  console.log("window.ethereum", window.ethereum);

  const authProvider = new EthereumAuthProvider(provider, address);
  await threeIdConnect.connect(authProvider);

  const didProvider = await threeIdConnect.getDidProvider();

  const resolver = {
    ...KeyDidResolver.getResolver(),
    ...ThreeIdResolver.getResolver(ceramic),
  };
  const did = new DID({ resolver });
  ceramic.did = did;
  console.log("did before:", did);
  ceramic.did.setProvider(didProvider);
  console.log("did middle:", did);
  await ceramic.did.authenticate();
  console.log("did after:", did);

  const idx = new IDX({ ceramic });

  return idx;
}
