import { toGatewayURL } from "nft.storage";
import { useState, useMemo } from "react";
import { useContract } from "../../hooks/useContract";

function NFTCard(props) {
  const [metadata, setMetadata] = useState();
  const publicationTokenContract = useContract("PublicationToken");

  const metadataPromise = useMemo(async () => {
    console.log("metadataMemo");

    const tokenURI = await publicationTokenContract.tokenURI(props.tokenId);

    const metadataFile = await fetch(toGatewayURL(tokenURI));
    return await metadataFile.json();
  }, [props.tokenId, publicationTokenContract]);

  metadataPromise.then((value) => {
    setMetadata(value);
  });

  return (
    <div className="card nft-card">
      {metadata && metadata.image && (
        <img
          className="card-img-top nft-card-image"
          alt={metadata.name}
          src={toGatewayURL(metadata.image)}
        />
      )}
      <div className="card-body">
        {metadata && metadata.name && (
          <div>
            <div className="font-weight-bold">{"Title:"}</div>
            <div>{metadata.name}</div>
          </div>
        )}
        {
          <div className="text-right card-corner mt-2">
            <span className="font-weight-bold">{`${
              parseInt(props.tokenId) + 1
            } of `}</span>
            <span className="font-weight-bold">{`${props.totalSupply}`}</span>
          </div>
        }
      </div>
    </div>
  );
}

export default NFTCard;
