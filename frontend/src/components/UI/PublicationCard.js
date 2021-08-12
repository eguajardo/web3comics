import { toGatewayURL } from "nft.storage";

import { useHistory } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

function PublicationCard(props) {
  const routerHistory = useHistory();
  const [metadata, setMetadata] = useState();

  const loadPublicationCard = useCallback(async () => {
    const metadataFile = await fetch(toGatewayURL(props.metadata));

    const json = await metadataFile.json();

    console.log("fetched metadata", json);

    setMetadata(json);
  }, [props.metadata]);

  useEffect(() => {
    loadPublicationCard();
  }, [loadPublicationCard]);

  const vewPublication = () => {
    routerHistory.push(`/comic/${props.publicationsStream}/${props.index}`);
    return <></>;
  };

  return (
    <div className="card publication-card" onClick={vewPublication}>
      <div className="row">
        <div className="col-md-2">
          <img
            className="publication-thumbnail img-fluid"
            alt={props.title}
            src={toGatewayURL(props.thumbnail)}
          />
        </div>
        <div className="col-md-9 my-auto">
          {metadata && <div className="font-weight-bold">{metadata.name}</div>}
        </div>
        <div className="col-md-1 my-auto">{`#${props.index + 1}`}</div>
      </div>
    </div>
  );
}

export default PublicationCard;
