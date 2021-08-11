import toast from "react-hot-toast";
import { web3storage } from "../helpers/ipfs";
import { TileDocument } from "@ceramicnetwork/stream-tile";

import { useState } from "react";
import { useFormFields } from "../hooks/useFormFields";
import { useProfile } from "../hooks/useProfile";
import { useHistory } from "react-router-dom";

import LoginCheck from "../components/UI/LoginCheck";
import PageContainer from "../components/Layout/PageContainer";
import FormGroup from "../components/UI/FormGroup";
import SubmitButton from "../components/UI/SubmitButton";

function NewComic() {
  const routerHistory = useHistory();
  const { idx } = useProfile();
  const [formProcessing, setFormProcessing] = useState(false);

  const {
    formFields,
    createValueChangeHandler,
    createInputBlurHandler,
    validateForm,
    hasError,
  } = useFormFields({
    image: {
      type: "file",
      id: "image",
      label: "Cover picture",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Cover picture is missing!";
        }
      },
    },
    title: {
      type: "text",
      id: "title",
      label: "Title",
      placeholder: "My awesome comic",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Title must not be empty!";
        }
      },
    },
    description: {
      type: "textarea",
      id: "description",
      label: "Description",
      placeholder:
        "Follow the adventures of Comictron in this awesome web3comic",
      rows: 5,
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Description must not be empty!";
        }
      },
    },
  });

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormProcessing(true);

    try {
      const cid = await web3storage.put(formFields.image.enteredFiles, {
        wrapWithDirectory: false,
      });
      console.log("cid", cid);

      const doc = await TileDocument.create(idx.ceramic, {
        author: idx.id,
        publications: [],
      });
      console.log(doc.content);
      const publicationsStream = doc.id.toString();
      await idx.ceramic.pin.add(publicationsStream);

      let comicsList = await idx.get("comics");
      console.log("comicsList:", comicsList);

      if (!comicsList) {
        comicsList = { comics: [] };
      }

      const newComic = {
        title: formFields.title.value,
        description: formFields.description.value,
        coverImageURL: `ipfs://${cid}`,
        publicationsStream: publicationsStream,
      };

      comicsList.comics.push(newComic);
      await idx.set("comics", comicsList);

      setFormProcessing(false);
      toast.success("New comic created!");

      routerHistory.push(`/comic/${newComic.publicationsStream}`);
      return <></>;
    } catch (err) {
      setFormProcessing(false);
      console.log(err);
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <PageContainer>
      {idx && idx.id && (
        <form onSubmit={formSubmissionHandler}>
          <FormGroup
            formField={formFields.title}
            hasError={hasError(formFields.title)}
            valueChangeHandler={createValueChangeHandler("title")}
            inputBlurHandler={createInputBlurHandler("title")}
          />
          <FormGroup
            formField={formFields.description}
            hasError={hasError(formFields.description)}
            valueChangeHandler={createValueChangeHandler("description")}
            inputBlurHandler={createInputBlurHandler("description")}
          />
          <FormGroup
            formField={formFields.image}
            hasError={hasError(formFields.image)}
            previewClass="img-thumbnail mb-4"
            valueChangeHandler={createValueChangeHandler("image")}
            inputBlurHandler={createInputBlurHandler("image")}
          />

          <SubmitButton formProcessing={formProcessing}>
            {!formProcessing && "Create Comic"}
          </SubmitButton>
        </form>
      )}
      <LoginCheck idx={idx} />
    </PageContainer>
  );
}

export default NewComic;
