import { anonymousIdx } from "../helpers/ceramic";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../hooks/useProfile";
import { useContract } from "../hooks/useContract";

import PageContainer from "../components/Layout/PageContainer";
import ActionsContainer from "../components/Layout/ActionsContainer";
import ComicCard from "../components/UI/ComicCard";
import { Link } from "react-router-dom";

function Comics() {
  const { did } = useParams();
  const { idx } = useProfile();
  const [content, setContent] = useState([]);
  const usersContract = useContract("Users");

  const loadComics = useCallback(async () => {
    let ceramicIdx = idx;
    if (!idx) {
      ceramicIdx = anonymousIdx();
    }

    let comicsList = [];
    if (did) {
      const userComics = await ceramicIdx.get("comics", did);
      comicsList = userComics?.comics ?? [];
    } else {
      if (!usersContract) {
        return;
      }

      const usersDids = await usersContract.dids();

      for (const userDid of usersDids) {
        const userComics = await ceramicIdx.get("comics", userDid);
        console.log("userComics", userComics);
        if (userComics && userComics.comics) {
          comicsList = [...comicsList, ...userComics.comics];
        }
      }
    }

    if (comicsList) {
      let comicsCards = [];

      comicsList.forEach((comic, i) => {
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
  }, [idx, did]);

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
