import { TileDocument } from "@ceramicnetwork/stream-tile";
import { anonymousIdx } from "../helpers/ceramic";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../hooks/useProfile";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import PublicationCard from "../components/UI/PublicationCard";
import { Link } from "react-router-dom";

function ViewComic() {
  const { publicationsStream } = useParams();
  const { idx } = useProfile();
  const [content, setContent] = useState([]);
  const [authorDid, setAuthorDid] = useState(null);

  const loadPublications = useCallback(async () => {
    let ceramic;
    if (!idx) {
      ceramic = (await anonymousIdx()).ceramic;
    } else {
      ceramic = idx.ceramic;
    }

    const tile = await TileDocument.load(ceramic, publicationsStream);
    // const content = { ...tile.content, author: idx.id };
    // await tile.update(content);
    console.log("tile.content", tile.content);
    setAuthorDid(tile.content.author);

    const publicationsList = tile.content.publications;

    if (publicationsList) {
      let comicsCards = [];

      publicationsList.forEach((publication, i) => {
        comicsCards.push(
          <PublicationCard
            key={i}
            index={i}
            metadata={publication.metadata}
            thumbnail={publication.thumbnail}
            publicationsStream={publicationsStream}
          />
        );
      });

      setContent(comicsCards);
    }
  }, [idx, publicationsStream]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  return (
    <div>
      <ActionsContainer>
        {idx && authorDid === idx.id && (
          <Link
            className="btn btn-info ml-2"
            to={`/comic/${publicationsStream}/new`}
          >
            Add new publication
          </Link>
        )}
      </ActionsContainer>
      <PageContainer>
        <div className="content-container">
          <div className="">{content}</div>
        </div>
      </PageContainer>
    </div>
  );
}

export default ViewComic;
