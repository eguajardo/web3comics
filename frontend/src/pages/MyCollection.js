import { useEffect, useCallback, useState } from "react";
import { useEthers } from "@usedapp/core";
import { useContract } from "../hooks/useContract";

import PageContainer from "../components/Layout/PageContainer";
import NFTCard from "../components/UI/NFTCard";

function MyCollection() {
  const { account } = useEthers();
  const [content, setContent] = useState();
  const publicationTokenContract = useContract("PublicationToken");

  const loadCollection = useCallback(async () => {
    if (!publicationTokenContract) {
      return null;
    }
    console.log("account", account);
    const balance = await publicationTokenContract.balanceOf(account);
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
      <div className="card-deck d-flex justify-content-center">{content}</div>
    </PageContainer>
  );
}

export default MyCollection;
