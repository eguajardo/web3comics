import toast from "react-hot-toast";
import { constants } from "ethers";
import { web3storage } from "../helpers/ipfs";
import { TileDocument } from "@ceramicnetwork/stream-tile";

import { useFormFields } from "../hooks/useFormFields";
import { useProfile } from "../hooks/useProfile";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useContract } from "../hooks/useContract";
import { useContractFunction } from "@usedapp/core";

import LoginCheck from "../components/UI/LoginCheck";
import PageContainer from "../components/Layout/PageContainer";
import FormGroup from "../components/UI/FormGroup";
import SubmitButton from "../components/UI/SubmitButton";

function Profile() {
  const location = useLocation();
  const routerHistory = useHistory();
  const { profile, setProfile, idx } = useProfile();
  const [formProcessing, setFormProcessing] = useState(false);
  const usersContract = useContract("Users");

  const { state: ethTxState, send: sendRegisterDid } = useContractFunction(
    usersContract,
    "registerDid"
  );

  console.log("Profile", profile);
  console.log("IDX", idx);

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
      label: "Profile picture",
    },
    name: {
      type: "text",
      id: "name",
      label: "Nickname",
      value: profile ? profile.name : null,
      placeholder: "Satoshi",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Name must not be empty!";
        }
      },
    },
  });

  useEffect(() => {
    if (profile) {
      formFields.name.value = profile.name;
    }
  }, [profile]);

  const finishProfileUpdate = useCallback(() => {
    setFormProcessing(false);
    toast.success("Profile updated!");

    let referer;
    if (location.state) {
      referer = location.state.referer;
    } else {
      referer = "/profile";
    }
    routerHistory.push(referer);
    return <></>;
  }, [location.state, routerHistory]);

  useEffect(() => {
    if (ethTxState && formProcessing) {
      switch (ethTxState.status) {
        case "Success":
          finishProfileUpdate();
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
  }, [ethTxState, formProcessing, finishProfileUpdate]);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormProcessing(true);

    try {
      let updatedProfile = { name: formFields.name.value };
      if (formFields.image.enteredFiles) {
        const cid = await web3storage.put(formFields.image.enteredFiles, {
          wrapWithDirectory: false,
        });
        console.log("cid", cid);

        updatedProfile.image = {
          original: {
            src: `ipfs://${cid}`,
            mimeType: formFields.image.enteredFiles[0].type,
            width: 500,
            height: 200,
          },
        };
      }
      if (!profile.commentsStream) {
        const tile = await TileDocument.create(idx.ceramic, {});
        const commentsStream = tile.id.toString();
        await idx.ceramic.pin.add(commentsStream);

        updatedProfile.commentsStream = commentsStream;
      }

      setProfile(idx, updatedProfile);

      const address = await usersContract.didAddress(idx.id);
      if (address === constants.AddressZero) {
        console.log("Registering DID in contract");
        sendRegisterDid(idx.id);
      } else {
        finishProfileUpdate();
        return <></>;
      }
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
            formField={formFields.image}
            hasError={hasError(formFields.image)}
            previewSrc={profile?.image?.original?.src ?? null}
            previewClass="profile-picture img-thumbnail mb-4"
            valueChangeHandler={createValueChangeHandler("image")}
            inputBlurHandler={createInputBlurHandler("image")}
          />
          <FormGroup
            formField={formFields.name}
            hasError={hasError(formFields.name)}
            valueChangeHandler={createValueChangeHandler("name")}
            inputBlurHandler={createInputBlurHandler("name")}
          />

          <SubmitButton formProcessing={formProcessing}>
            {!profile && !formProcessing && "Create Profile"}
            {profile && !formProcessing && "Update Profile"}
          </SubmitButton>
        </form>
      )}
      <LoginCheck idx={idx} />
    </PageContainer>
  );
}

export default Profile;
