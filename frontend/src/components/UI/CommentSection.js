import toast from "react-hot-toast";
import { anonymousIdx } from "../../helpers/ceramic";
import { TileDocument } from "@ceramicnetwork/stream-tile";

import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFormFields } from "../../hooks/useFormFields";
import { useContract } from "../../hooks/useContract";

import FormGroup from "./FormGroup";
import SubmitButton from "./SubmitButton";
import Comment from "./Comment";

function CommentSection() {
  const { publicationsStream, index } = useParams();
  const { profile, idx } = useProfile();
  const [formProcessing, setFormProcessing] = useState(false);
  const [comments, setComments] = useState([]);
  const usersContract = useContract("Users");

  const {
    formFields,
    createValueChangeHandler,
    createInputBlurHandler,
    validateForm,
    hasError,
    resetForm,
  } = useFormFields({
    comment: {
      type: "textarea",
      id: "comment",
      rows: 3,
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return <div></div>;
        }
      },
    },
  });

  const loadComments = useCallback(async () => {
    if (!usersContract) {
      return;
    }

    let ceramicIdx = idx;
    if (!idx) {
      ceramicIdx = anonymousIdx();
    }

    const dids = await usersContract.dids();

    console.log("all dids", dids);

    let loadedComments = [];
    for (const did of dids) {
      const commentsStream = (await ceramicIdx.get("basicProfile", did))
        .commentsStream;

      console.log("commentsStream", commentsStream);

      const tile = await TileDocument.load(ceramicIdx.ceramic, commentsStream);

      console.log("tile.content", tile.content);

      if (
        tile.content[publicationsStream] &&
        tile.content[publicationsStream][index]
      ) {
        const didComments = tile.content[publicationsStream][index];

        didComments.sort((first, second) => {
          if (second.timestamp > first.timestamp) {
            return 1;
          } else if (first.timestamp > second.timestamp) {
            return -1;
          }

          return 0;
        });

        didComments.forEach((didComment) => {
          console.log("Comment added", didComment.comment);
          loadedComments.push(
            <Comment
              did={did}
              comment={didComment.comment}
              timestamp={didComment.timestamp}
            />
          );
        });
      }
    }

    console.log("new loaded comments", loadedComments);
    setComments(loadedComments);
  }, [usersContract, idx, index, publicationsStream]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (!idx || !idx.id) {
      formFields.comment.placeholder = "Please login to leave a comment";
    } else {
      formFields.comment.placeholder = "";
    }
  }, [idx, formFields.comment]);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormProcessing(true);

    try {
      const tile = await TileDocument.load(idx.ceramic, profile.commentsStream);
      console.log("tile.content", tile.content);

      let comments = tile.content;
      if (!comments[publicationsStream]) {
        comments[publicationsStream] = {};
      }
      if (!comments[publicationsStream][index]) {
        comments[publicationsStream][index] = [];
      }
      comments[publicationsStream][index].push({
        comment: formFields.comment.value,
        timestamp: Date.now(),
      });
      console.log("new comments", comments);
      await tile.update(comments);

      console.log("new tile", tile.content);

      resetForm();

      setFormProcessing(false);
      loadComments();
      toast.success("Comment posted!");
    } catch (err) {
      setFormProcessing(false);
      console.log(err);
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <div className="container mb-4">
      <div>
        <h4>Comments</h4>
      </div>
      <form onSubmit={formSubmissionHandler} className="mb-4">
        <div>
          <FormGroup
            formField={formFields.comment}
            hasError={hasError(formFields.comment)}
            valueChangeHandler={createValueChangeHandler("comment")}
            inputBlurHandler={createInputBlurHandler("comment")}
            disabled={!idx || !idx.id}
          />
        </div>
        {idx && idx.id && (
          <div className="text-right">
            <SubmitButton
              formProcessing={formProcessing}
              className="btn btn-primary"
            >
              {!formProcessing && "Submit"}
            </SubmitButton>
          </div>
        )}
      </form>

      {comments}
    </div>
  );
}

export default CommentSection;
