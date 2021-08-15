import { useEffect, useCallback, useState } from "react";
import { useEthers } from "@usedapp/core";
import { useContract } from "../hooks/useContract";

import PageContainer from "../components/Layout/PageContainer";
import NFTCard from "../components/UI/NFTCard";

function MyCollection() {
  const { account } = useEthers();
  const [content, setContent] = useState();
  const [noBalance, setNoBalance] = useState(false);
  const publicationTokenContract = useContract("PublicationToken");

  const loadCollection = useCallback(async () => {
    if (!publicationTokenContract) {
      return null;
    }
    console.log("account", account);
    const balance = await publicationTokenContract.balanceOf(account);
    console.log("nft balance", balance);
    if (parseInt(balance) === 0) {
      setNoBalance(true);
      return;
    }
    const totalSupply = await publicationTokenContract.totalSupply();

    let cardsDeck = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await publicationTokenContract.tokenOfOwnerByIndex(
        account,
        i
      );
      console.log("Token ID:", tokenId);

      cardsDeck.push(
        <NFTCard key={i} tokenId={tokenId} totalSupply={totalSupply} />
      );
    }

    setContent(cardsDeck);
  }, [account, publicationTokenContract]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  return (
    <PageContainer>
      <div className="card-deck d-flex justify-content-center">
        {noBalance &&
          "You haven't purchased any NFT yet! Start supporting your favorite authors by purchasing and collecting their comics!"}
        {content}
      </div>
    </PageContainer>
  );
}

export default MyCollection;
