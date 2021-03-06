import toast from "react-hot-toast";
import { web3storage, nftStorage } from "../helpers/ipfs";
import { utils } from "ethers";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Blob } from "web3.storage/dist/bundle.esm.min.js";

import { useState, useEffect } from "react";
import { useFormFields } from "../hooks/useFormFields";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../hooks/useProfile";
import { useContract } from "../hooks/useContract";
import { useHistory } from "react-router-dom";
import { useContractFunction } from "@usedapp/core";

import LoginCheck from "../components/UI/LoginCheck";
import PageContainer from "../components/Layout/PageContainer";
import FormGroup from "../components/UI/FormGroup";
import SubmitButton from "../components/UI/SubmitButton";

function NewPublication() {
  const { publicationsStream } = useParams();
  const routerHistory = useHistory();
  const { idx } = useProfile();
  const [formProcessing, setFormProcessing] = useState(false);

  const publicationStoreContract = useContract("PublicationStore");
  const { state: ethTxState, send: sendCreatePublicationStore } =
    useContractFunction(publicationStoreContract, "createPublicationStore");

  const {
    formFields,
    createValueChangeHandler,
    createInputBlurHandler,
    validateForm,
    hasError,
  } = useFormFields({
    title: {
      type: "text",
      id: "title",
      label: "Title",
      placeholder: "Episode 42: The answer",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Title must not be empty!";
        }
      },
    },
    price: {
      type: "number",
      id: "price",
      label: "Price (MATIC token)",
      step: 0.001,
      validator: (field) => {
        if (!field.value || field.value <= 0) {
          console.log("price value:", field.value);
          return "Price must not be zero!";
        }
      },
    },
    thumbnail: {
      type: "file",
      id: "thumbnail",
      label: "Thumbnail (100px x 100px)",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Thumbnail is missing!";
        }
      },
    },
    image: {
      type: "file",
      id: "image",
      label: "Content image",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Image is missing!";
        }
      },
    },
  });

  useEffect(() => {
    if (ethTxState && formProcessing) {
      switch (ethTxState.status) {
        case "Success":
          setFormProcessing(false);
          toast.success("Publication created!");

          routerHistory.push(`/comic/${publicationsStream}`);
          return <></>;
        case "Exception":
        case "Fail":
          setFormProcessing(false);
          console.log("Transaction Error:", ethTxState.errorMessage);
          toast.error(ethTxState.errorMessage);
          break;
        default:
          console.log("Transaction status:", ethTxState.status);
      }
    }
  }, [ethTxState, formProcessing, routerHistory, publicationsStream]);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormProcessing(true);

    try {
      const thumbnailCid = await web3storage.put(
        formFields.thumbnail.enteredFiles,
        {
          wrapWithDirectory: false,
        }
      );

      console.log("Uploaded thumbnail to web3.storage");

      /// nft.storage takes way too long, switched to web3.storage
      // const metadata = await nftStorage.store({
      //   name: formFields.title.value,
      //   description: formFields.title.value,
      //   image: formFields.image.enteredFiles[0],
      // });

      const imageCid = await web3storage.put(formFields.image.enteredFiles, {
        wrapWithDirectory: false,
      });

      const metadataBlob = new Blob([
        JSON.stringify({
          name: formFields.title.value,
          description: formFields.title.value,
          image: `ipfs://${imageCid}`,
        }),
      ]);

      const files = [new File([metadataBlob], "metadata.json")];
      const metadataCid = await web3storage.put(files, {
        wrapWithDirectory: false,
      });

      const metadataUrl = `ipfs://${metadataCid}`;

      console.log("Uploaded metadata to nft.storage");
      console.log("metadata.url", metadataUrl);

      const tile = await TileDocument.load(idx.ceramic, publicationsStream);

      console.log("Loaded publication stream");

      let newContent = tile.content;
      newContent.publications.push({
        thumbnail: `ipfs://${thumbnailCid}`,
        metadata: metadataUrl,
      });

      console.log("newContent", newContent);

      const index = newContent.publications.length - 1;

      await tile.update(newContent);

      console.log("Updated publication stream");

      sendCreatePublicationStore(
        publicationsStream,
        index,
        metadataUrl,
        utils.parseEther(formFields.price.value)
      );
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
            formField={formFields.price}
            hasError={hasError(formFields.price)}
            valueChangeHandler={createValueChangeHandler("price")}
            inputBlurHandler={createInputBlurHandler("price")}
          />
          <FormGroup
            formField={formFields.thumbnail}
            hasError={hasError(formFields.thumbnail)}
            previewClass="publication-thumbnail img-fluid mb-4"
            valueChangeHandler={createValueChangeHandler("thumbnail")}
            inputBlurHandler={createInputBlurHandler("thumbnail")}
          />
          <FormGroup
            formField={formFields.image}
            hasError={hasError(formFields.image)}
            previewClass="img-thumbnail mb-4"
            valueChangeHandler={createValueChangeHandler("image")}
            inputBlurHandler={createInputBlurHandler("image")}
          />

          <SubmitButton formProcessing={formProcessing}>
            {!formProcessing && "Add page to comic"}
          </SubmitButton>
        </form>
      )}
      <LoginCheck idx={idx} />
    </PageContainer>
  );
}

export default NewPublication;
