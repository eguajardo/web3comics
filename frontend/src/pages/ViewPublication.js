import { TileDocument } from "@ceramicnetwork/stream-tile";
import { anonymousIdx } from "../helpers/ceramic";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useCallback, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import { Link } from "react-router-dom";

function ViewPublication() {
  const { publicationsStream, index } = useParams();
  const { idx } = useProfile();
  const [previousIndex, setPreviousIndex] = useState();
  const [nextIndex, setNextIndex] = useState();

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

    const previous = currentIndex > 0 ? currentIndex - 1 : null;
    const next =
      currentIndex < publicationsList.length - 1 ? currentIndex + 1 : null;

    setPreviousIndex(previous);
    setNextIndex(next);

    console.log("currentIndex", currentIndex);
    console.log("previous", previous);
    console.log("next", next);
  }, [idx, publicationsStream]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

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
            disabled={!previousIndex}
          >
            Prev
          </button>
        </Link>
        <Link to={`/comic/${publicationsStream}/${nextIndex}`}>
          <button className="btn btn-outline-info ml-2" disabled={!nextIndex}>
            Next
          </button>
        </Link>
      </ActionsContainer>
      <PageContainer></PageContainer>
    </div>
  );
}

export default ViewPublication;
