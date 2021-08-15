import { toGatewayURL } from "nft.storage";
import { useCallback, useEffect, useState } from "react";
import { anonymousIdx } from "../../helpers/ceramic";

function Comment(props) {
  const [profile, setProfile] = useState();

  const loadProfile = useCallback(async () => {
    const basicProfile = await anonymousIdx().get("basicProfile", props.did);

    setProfile(basicProfile);
  }, [props.did]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  console.log("profile from comment", profile);

  return (
    <div className="card comment-card no-decorations">
      <div className="row">
        <div className="col-md-2">
          {profile && (
            <div>
              <div>
                <img
                  className="profile-picture-comment m-2"
                  alt={profile.name}
                  src={toGatewayURL(profile.image.original.src)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-md-10">
          <div className="mt-2 mr-2 d-flex justify-content-between align-items-center">
            {profile && <div className="font-weight-bold">{profile.name}</div>}
            <div>
              <span className="comment-timestamp">
                {new Date(props.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div>{props.comment}</div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
