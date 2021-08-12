import { toGatewayURL } from "nft.storage";

import { useHistory } from "react-router-dom";

function ComicCard(props) {
  const routerHistory = useHistory();

  const viewComic = () => {
    routerHistory.push(`/comic/${props.publicationsStream}`);
    return <></>;
  };

  return (
    <div className="card comic-card" onClick={viewComic}>
      <div className="row">
        <div className="col-md-5">
          <img
            className="img-fluid"
            alt={props.title}
            src={toGatewayURL(props.coverImageURL)}
          />
        </div>
        <div className="col-md-7">
          <div className="mr-4">
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
      </div>
    </div>
  );
}

export default ComicCard;
