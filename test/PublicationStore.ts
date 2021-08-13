import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "@ethersproject/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "ethers";

describe("PublicationStore contract", () => {
  const STREAM_ID: string = "someFakeStreamId";
  const PUBLICATION_INDEX: number = 0;
  const IPFS_URI: string = "someFakeIPFSpath";
  const PRICE: Number = 1;

  let publicationStore: Contract;
  let publicationToken: Contract;
  let signers: SignerWithAddress[];
  let authorSigner1: SignerWithAddress;
  let authorSigner2: SignerWithAddress;
  let buyerSigner: SignerWithAddress;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    authorSigner1 = signers[1];
    authorSigner2 = signers[2];
    buyerSigner = signers[3];

    const utilsFactory: ContractFactory = await ethers.getContractFactory(
      "Utils",
      signers[0]
    );
    const utils = await utilsFactory.deploy();
    await utils.deployed();

    const publicationStoreFactory: ContractFactory =
      await ethers.getContractFactory("PublicationStore", {
        signer: signers[0],
        libraries: {
          Utils: utils.address,
        },
      });

    publicationStore = await publicationStoreFactory.deploy("TOKEN", "TKN");
    await publicationStore.deployed();

    const PublicationTokenFactory: ContractFactory =
      await ethers.getContractFactory("PublicationToken", {
        signer: buyerSigner,
      });
    publicationToken = PublicationTokenFactory.attach(
      await publicationStore.tokenContractAddress()
    );
  });

  it("Creates publication store successfully", async () => {
    const tx1: TransactionResponse = await publicationStore
      .connect(authorSigner1)
      .createPublicationStore(STREAM_ID, PUBLICATION_INDEX, IPFS_URI, PRICE);
    await expect(tx1)
      .to.emit(publicationStore, "PublicationStoreCreated")
      .withArgs(authorSigner1.address, STREAM_ID, PUBLICATION_INDEX);

    const tx2: TransactionResponse = await publicationStore
      .connect(authorSigner2)
      .createPublicationStore(
        STREAM_ID,
        PUBLICATION_INDEX + 1,
        IPFS_URI,
        PRICE
      );
    await expect(tx2)
      .to.emit(publicationStore, "PublicationStoreCreated")
      .withArgs(authorSigner2.address, STREAM_ID, PUBLICATION_INDEX + 1);
  });

  it("Fails publication store creation with empty stream Id", async () => {
    // this only works with automining. In case of mining delays, we have to wait
    await expect(
      publicationStore.createPublicationStore(
        "",
        PUBLICATION_INDEX,
        IPFS_URI,
        PRICE
      )
    ).to.be.revertedWith("ERROR_EMPTY_STREAM_ID");
  });

  it("Fails publication store creation with empty ipfs URI", async () => {
    // this only works with automining. In case of mining delays, we have to wait
    await expect(
      publicationStore.createPublicationStore(
        STREAM_ID,
        PUBLICATION_INDEX,
        "",
        PRICE
      )
    ).to.be.revertedWith("ERROR_EMPTY_URI");
  });

  it("Fails publication store creation with no minimum price", async () => {
    // this only works with automining. In case of mining delays, we have to wait
    await expect(
      publicationStore.createPublicationStore(
        STREAM_ID,
        PUBLICATION_INDEX,
        IPFS_URI,
        0
      )
    ).to.be.revertedWith("ERROR_PRICE_UNDER_LIMIT");
  });

  it("Buys token successfully", async () => {
    await publicationStore
      .connect(authorSigner1)
      .createPublicationStore(STREAM_ID, PUBLICATION_INDEX, IPFS_URI, PRICE);

    // second store
    await publicationStore
      .connect(authorSigner1)
      .createPublicationStore(
        STREAM_ID,
        PUBLICATION_INDEX + 1,
        IPFS_URI + "_SECOND",
        PRICE
      );

    // first transaction
    const tx: TransactionResponse = await publicationStore.buyToken(
      STREAM_ID,
      PUBLICATION_INDEX,
      { value: 1 }
    );

    await expect(tx)
      .to.emit(publicationStore, "PublicationPurchased")
      .withArgs(0, STREAM_ID, PUBLICATION_INDEX);

    const uri: string = await publicationToken.tokenURI(0);
    expect(uri).to.equals(IPFS_URI);

    // second transaction
    const tx2: TransactionResponse = await publicationStore.buyToken(
      STREAM_ID,
      PUBLICATION_INDEX + 1,
      { value: 1 }
    );

    await expect(tx2)
      .to.emit(publicationStore, "PublicationPurchased")
      .withArgs(1, STREAM_ID, PUBLICATION_INDEX + 1);

    const uri2: string = await publicationToken.tokenURI(1);
    expect(uri2).to.equals(IPFS_URI + "_SECOND");
  });

  it("Fails purchase without amount", async () => {
    await publicationStore
      .connect(authorSigner1)
      .createPublicationStore(STREAM_ID, PUBLICATION_INDEX, IPFS_URI, PRICE);

    await expect(
      publicationStore.buyToken(STREAM_ID, PUBLICATION_INDEX)
    ).to.be.revertedWith("ERROR_INVALID_AMOUNT");
  });

  it("Fails purchase with invalid amount", async () => {
    await publicationStore
      .connect(authorSigner1)
      .createPublicationStore(STREAM_ID, PUBLICATION_INDEX, IPFS_URI, PRICE);

    await expect(
      publicationStore.buyToken(STREAM_ID, PUBLICATION_INDEX, { value: 2 })
    ).to.be.revertedWith("ERROR_INVALID_AMOUNT");
  });

  it("Fails purchase invalid stream/index", async () => {
    await expect(
      publicationStore.buyToken(STREAM_ID, PUBLICATION_INDEX, { value: 1 })
    ).to.be.revertedWith("ERROR_INVALID_STREAM_OR_INDEX");
  });
});
