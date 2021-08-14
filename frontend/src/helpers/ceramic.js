import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";

import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";

import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";

export function anonymousIdx() {
  const ceramic = new Ceramic("http://localhost:7007");
  // const ceramic = new Ceramic("https://ceramic-clay.3boxlabs.com");

  const aliases = {
    comics: "kjzl6cwe1jw147w5a0pmkedsnai26uizx2oyf6b7gu753a0qdw1r8elhtgxmi7z",
  };

  return new IDX({ ceramic, aliases });
}

export async function newIdx(provider, address) {
  const idx = anonymousIdx();
  const ceramic = await idx.ceramic;

  const threeIdConnect = new ThreeIdConnect();

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

  console.log("IDX", idx);
  return idx;
}
