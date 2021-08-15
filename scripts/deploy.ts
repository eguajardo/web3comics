import { Contract, ContractFactory } from "@ethersproject/contracts";
import { artifacts, ethers, network } from "hardhat";

async function main() {
  console.log("Deploying to network:", network.name);

  const Utils: ContractFactory = await ethers.getContractFactory("Utils");
  const utils: Contract = await Utils.deploy();
  await utils.deployed();

  const Users: ContractFactory = await ethers.getContractFactory("Users");
  const users: Contract = await Users.deploy();
  await users.deployed();

  const publicationStoreFactory: ContractFactory =
    await ethers.getContractFactory("PublicationStore", {
      libraries: {
        Utils: utils.address,
      },
    });
  const publicationStore: Contract = await publicationStoreFactory.deploy(
    "Web3comic Publication",
    "WCP"
  );
  await publicationStore.deployed();

  const publicationTokenFactory: ContractFactory =
    await ethers.getContractFactory("PublicationToken");
  const publicationToken = publicationTokenFactory.attach(
    await publicationStore.tokenContractAddress()
  );

  console.log("Utils contract address:", utils.address);
  console.log("Users contract Address:", users.address);
  console.log("PublicationStore contract Address:", publicationStore.address);
  console.log("PublicationToken contract address:", publicationToken.address);

  console.log("Saving frontend files...");
  saveFrontEndFiles([
    { name: "Users", address: users.address },
    { name: "PublicationStore", address: publicationStore.address },
    { name: "PublicationToken", address: publicationToken.address },
  ]);
  console.log("Front end files saved");
}

function saveFrontEndFiles(contractsId: { name: string; address: string }[]) {
  const fs = require("fs");
  const javascriptDir = __dirname + "/../frontend/src/helpers";

  if (!fs.existsSync(javascriptDir)) {
    fs.mkdirSync(javascriptDir);
  }

  let contracts: any = { [network.name]: {} };
  for (let i = 0; i < contractsId.length; i++) {
    const artifact = artifacts.readArtifactSync(contractsId[i].name);

    contracts[network.name][contractsId[i].name] = {
      address: contractsId[i].address,
      abi: artifact.abi,
    };
  }

  fs.writeFileSync(
    javascriptDir + "/contracts.js",
    "export const contracts = " + JSON.stringify(contracts, null, 2) + ";"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
