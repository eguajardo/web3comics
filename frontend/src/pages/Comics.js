import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../hooks/useProfile";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import ComicCard from "../components/UI/ComicCard";
import { Link } from "react-router-dom";

function Comics() {
  const { did } = useParams();
  const { idx } = useProfile();
  const [content, setContent] = useState([]);

  const loadComics = useCallback(async () => {
    let comicsList = [];
    if (idx) {
      comicsList = await idx.get("comics");
    }

    if (comicsList && comicsList.comics) {
      let comicsCards = [];

      comicsList.comics.forEach((comic, i) => {
        comicsCards.push(
          <ComicCard
            key={i}
            title={comic.title}
            description={comic.description}
            coverImageURL={comic.coverImageURL}
            publicationsStream={comic.publicationsStream}
          />
        );
      });

      setContent(comicsCards);
    }
  }, [idx]);

  useEffect(() => {
    loadComics();
  }, [loadComics]);

  return (
    <div>
      <ActionsContainer>
        {idx && did === idx.id && (
          <Link className="btn btn-info ml-2" to="/comic/new">
            Add new comic
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

export default Comics;
