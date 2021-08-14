import toast from "react-hot-toast";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { anonymousIdx } from "../helpers/ceramic";
import { toGatewayURL } from "nft.storage";
import { utils } from "ethers";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useProfile } from "../hooks/useProfile";
import { useContract } from "../hooks/useContract";
import { useContractFunction } from "@usedapp/core";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import { Link } from "react-router-dom";
import LoadingDots from "../components/UI/LoadingDots";
import SubmitButton from "../components/UI/SubmitButton";

function ViewPublication() {
  const { publicationsStream, index } = useParams();
  const { idx } = useProfile();
  const [previousIndex, setPreviousIndex] = useState();
  const [nextIndex, setNextIndex] = useState();
  const [metadata, setMetadata] = useState();
  const [publicationsList, setPublicationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formProcessing, setFormProcessing] = useState(false);
  const [publicationPrice, setPublicationPrice] = useState();
  const publicationStoreContract = useContract("PublicationStore");

  const { state: ethTxState, send: sendBuyToken } = useContractFunction(
    publicationStoreContract,
    "buyToken"
  );

  const publicationsListPromise = useMemo(async () => {
    console.log("publicationsListMemo");

    let ceramic;
    if (!idx) {
      ceramic = anonymousIdx().ceramic;
    } else {
      ceramic = idx.ceramic;
    }
    const tile = await TileDocument.load(ceramic, publicationsStream);
    return tile.content.publications;
  }, [idx, publicationsStream]);

  publicationsListPromise.then((value) => {
    setPublicationsList(value);
  });

  const metadataPromise = useMemo(async () => {
    console.log("metadataMemo");

    if (publicationsList.length === 0) {
      return null;
    }

    const currentIndex = parseInt(index);

    console.log("publicationsList", publicationsList);

    const metadataFile = await fetch(
      toGatewayURL(publicationsList[currentIndex].metadata)
    );
    return await metadataFile.json();
  }, [index, publicationsList]);

  metadataPromise.then((value) => {
    setMetadata(value);
  });

  const loadFromIPFS = useCallback(async () => {
    const currentIndex = parseInt(index);

    const previous = currentIndex > 0 ? currentIndex - 1 : null;
    const next =
      currentIndex < publicationsList.length - 1 ? currentIndex + 1 : null;
    setPreviousIndex(previous);
    setNextIndex(next);
  }, [index, publicationsList]);

  const loadFromSmartContract = useCallback(async () => {
    const publicationData = await publicationStoreContract.publicationData(
      publicationsStream,
      parseInt(index)
    );
    setPublicationPrice(utils.formatEther(publicationData.price));
  }, [publicationsStream, publicationStoreContract, index]);

  useEffect(() => {
    loadFromIPFS();
  }, [loadFromIPFS]);

  useEffect(() => {
    loadFromSmartContract();
  }, [loadFromSmartContract]);

  const imageLoaded = () => {
    setLoading(false);
  };

  const reset = () => {
    setMetadata(null);
    setLoading(true);
  };

  useEffect(() => {
    if (ethTxState && formProcessing) {
      switch (ethTxState.status) {
        case "Success":
          setFormProcessing(false);
          toast.success("Publication added to your collection!");

          break;
        case "Exception":
        case "Fail":
          setFormProcessing(false);
          console.log("Transaction Error:", ethTxState.errorMessage);
          toast.error(ethTxState.errorMessage);
          break;
        default:
          console.log("Transaction status:", ethTxState.status);
      }
    }
  }, [ethTxState, formProcessing, publicationsStream]);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    setFormProcessing(true);

    sendBuyToken(publicationsStream, parseInt(index), {
      value: utils.parseEther(publicationPrice),
    });
  };

  return (
    <div>
      <ActionsContainer>
        <Link
          className="btn btn-outline-info ml-2"
          to={`/comic/${publicationsStream}`}
        >
          Back to Index
        </Link>
        <Link to={`/comic/${publicationsStream}/${previousIndex}`}>
          <button
            className="btn btn-outline-info ml-2"
            disabled={!previousIndex && previousIndex !== 0}
            onClick={reset}
          >
            Prev
          </button>
        </Link>
        <Link to={`/comic/${publicationsStream}/${nextIndex}`}>
          <button
            className="btn btn-outline-info ml-2"
            disabled={!nextIndex && nextIndex !== 0}
            onClick={reset}
          >
            Next
          </button>
        </Link>
      </ActionsContainer>
      <PageContainer>
        <div style={{ display: loading ? "block" : "none" }}>
          <LoadingDots />
        </div>
        {metadata && metadata.image && (
          <div tyle={{ display: loading ? "none" : "block" }}>
            <img
              className="img-fluid"
              alt={index}
              src={toGatewayURL(metadata.image)}
              onLoad={imageLoaded}
            />
          </div>
        )}
        {publicationPrice && (
          <form onSubmit={formSubmissionHandler}>
            <SubmitButton formProcessing={formProcessing}>
              {!formProcessing &&
                `Buy and collect for ${publicationPrice} MATIC`}
            </SubmitButton>
          </form>
        )}
      </PageContainer>
    </div>
  );
}

export default ViewPublication;
