import FormGroup from "../components/UI/FormGroup";
import { useFormFields } from "../hooks/useFormFields";
import { useProfile } from "../hooks/useProfile";
import { web3storage } from "../helpers/ipfs";

function Profile() {
  const { profile, setProfile, idx } = useProfile();

  console.log("profile", profile);
  console.log("idx", idx);

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

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("entered image", formFields.image.enteredFiles);

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

    // FIXME: should call setProfile
    await idx.merge("basicProfile", updatedProfile);
    console.log("Updated profile");
  };

  return (
    <div className="container content-container">
      {idx && idx.id && (
        <form onSubmit={formSubmissionHandler}>
          <FormGroup
            formField={formFields.image}
            hasError={hasError(formFields.image)}
            previewSrc={profile.image.original.src}
            valueChangeHandler={createValueChangeHandler("image")}
            inputBlurHandler={createInputBlurHandler("image")}
          />
          <FormGroup
            formField={formFields.name}
            hasError={hasError(formFields.name)}
            valueChangeHandler={createValueChangeHandler("name")}
            inputBlurHandler={createInputBlurHandler("name")}
          />

          <button name="submit" className="btn btn-primary btn-lg btn-block">
            {!profile && "Create Profile"}
            {profile && "Update Profile"}
          </button>
        </form>
      )}
      {(!idx || !idx.id) && <div>Please Login first</div>}
    </div>
  );
}

export default Profile;
