import { TileDocument } from "@ceramicnetwork/stream-tile";
import { anonymousIdx } from "../helpers/ceramic";
import { toGatewayURL } from "nft.storage";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useCallback, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import { Link } from "react-router-dom";
import LoadingDots from "../components/UI/LoadingDots";

function ViewPublication() {
  const { publicationsStream, index } = useParams();
  const { idx } = useProfile();
  const [previousIndex, setPreviousIndex] = useState();
  const [nextIndex, setNextIndex] = useState();
  const [metadata, setMetadata] = useState();
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    let ceramic;
    if (!idx) {
      ceramic = (await anonymousIdx()).ceramic;
    } else {
      ceramic = idx.ceramic;
    }

    const tile = await TileDocument.load(ceramic, publicationsStream);
    const publicationsList = tile.content.publications;

    const currentIndex = parseInt(index);

    const metadataFile = await fetch(
      toGatewayURL(publicationsList[currentIndex].metadata)
    );
    const json = await metadataFile.json();

    setMetadata(json);

    const previous = currentIndex > 0 ? currentIndex - 1 : null;
    const next =
      currentIndex < publicationsList.length - 1 ? currentIndex + 1 : null;

    setPreviousIndex(previous);
    setNextIndex(next);
  }, [idx, publicationsStream, index]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const imageLoaded = () => {
    setLoading(false);
  };

  const reset = () => {
    setMetadata(null);
    setLoading(true);
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
      </PageContainer>
    </div>
  );
}

export default ViewPublication;
