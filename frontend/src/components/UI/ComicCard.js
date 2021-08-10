import { toGatewayURL } from "nft.storage";

import { useHistory } from "react-router-dom";

function ComicCard(props) {
  const routerHistory = useHistory();

  const viewComic = () => {
    routerHistory.push(`/comic/${props.publicationsStream}`);
    return <></>;
  };

  return (
    <div className="card" onClick={viewComic}>
      <img
        className="card-img-top"
        alt={props.title}
        src={toGatewayURL(props.coverImageURL)}
      />
      <div className="card-body">
        <div>
          <div className="mt-2 font-weight-bold">{"Title:"}</div>
          <div>{props.title}</div>
        </div>

        <div>
          <div className="font-weight-bold">{"Description:"}</div>
          <div>{props.description}</div>
        </div>
      </div>
    </div>
  );
}

export default ComicCard;
