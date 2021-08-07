import FormGroup from "../components/UI/FormGroup";
import { useFormFields } from "../hooks/useFormFields";
import { useProfile } from "../hooks/useProfile";
import { web3storage } from "../helpers/ipfs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useHistory } from "react-router-dom";

function Profile() {
  const location = useLocation();
  const routerHistory = useHistory();
  const { profile, setProfile, idx } = useProfile();
  const [formProcessing, setFormProcessing] = useState(false);

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

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormProcessing(true);

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

    try {
      setProfile(idx, updatedProfile);
      setFormProcessing(false);
      toast.success("Profile updated!");

      let referer;
      if (location.state !== undefined) {
        referer = location.state.referer;
      } else {
        referer = "/";
      }
      routerHistory.push(referer);
      return <></>;
    } catch (err) {
      setFormProcessing(false);
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="container content-container">
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

          <button
            name="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={formProcessing}
          >
            {!profile && !formProcessing && "Create Profile"}
            {profile && !formProcessing && "Update Profile"}
            {formProcessing && (
              <span>
                <span
                  class="spinner-grow spinner-grow-sm ml-2 mb-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span
                  class="spinner-grow spinner-grow-sm ml-2 mb-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span
                  class="spinner-grow spinner-grow-sm ml-2 mb-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              </span>
            )}
          </button>
        </form>
      )}
      {(!idx || !idx.id) && <div>Please Login first</div>}
    </div>
  );
}

export default Profile;
