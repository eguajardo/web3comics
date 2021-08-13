import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "@ethersproject/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, ContractFactory } from "ethers";

describe("PublicationToken contract", () => {
  const STREAM_ID: string = "someFakeStreamId";
  const PUBLICATION_INDEX: number = 0;
  const IPFS_URI: string = "someFakeIPFSpath";
  const PRICE: Number = 1;

  let publicationStore: Contract;
  let publicationToken: Contract;
  let signers: SignerWithAddress[];
  let authorSigner: SignerWithAddress;
  let minterSigner: SignerWithAddress;
  let storeGenerator: Function;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    minterSigner = signers[1];
    authorSigner = signers[2];

    const utilsFactory: ContractFactory = await ethers.getContractFactory(
      "Utils",
      signers[0]
    );
    const utils = await utilsFactory.deploy();
    await utils.deployed();

    const PublicationTokenFactory: ContractFactory =
      await ethers.getContractFactory("PublicationToken", {
        signer: minterSigner,
      });

    publicationToken = await PublicationTokenFactory.deploy(
      "TOKEN",
      "TKN",
      minterSigner.address
    );
    await publicationToken.deployed();
  });

  it("Mints NFT token", async () => {
    const tx: TransactionResponse = await publicationToken.mint(
      signers[3].address, // receptor
      IPFS_URI
    );

    await expect(tx)
      .to.emit(publicationToken, "Minted")
      .withArgs(0, signers[3].address, IPFS_URI);

    const tx2: TransactionResponse = await publicationToken.mint(
      signers[3].address, // receptor
      "SOME_OTHER_URI"
    );

    await expect(tx2)
      .to.emit(publicationToken, "Minted")
      .withArgs(1, signers[3].address, "SOME_OTHER_URI");

    const balance: BigNumber = await publicationToken.balanceOf(
      signers[3].address
    );
    expect(balance.toNumber()).to.equals(2);
  });

  it("Fails minting without minter role", async () => {
    await expect(
      publicationToken.connect(signers[3]).mint(
        signers[3].address, // receptor
        IPFS_URI
      )
    ).to.be.revertedWith("ERROR_UNAUTHORIZED_MINTER");
  });

  it("Fails with invalid tokenID", async () => {
    await expect(publicationToken.tokenURI(0)).to.be.revertedWith(
      "ERC721URIStorage: URI query for nonexistent token"
    );
  });
});
