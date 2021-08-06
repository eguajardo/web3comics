import FormGroup from "../components/UI/FormGroup";
import { useFormFields } from "../hooks/useFormFields";

function Profile() {
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
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Image is missing!";
        }
      },
    },
    name: {
      type: "text",
      id: "name",
      label: "Nickname",
      placeholder: "Satoshi",
      validator: (field) => {
        if (!field.value || field.value.trim() === "") {
          return "Name must not be empty!";
        }
      },
    },
  });

  console.log("formFields.image", formFields.image);
  console.log("formFields.name", formFields.name);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    validateForm();
  };

  return (
    <div className="container content-container">
      <form onSubmit={formSubmissionHandler}>
        <FormGroup
          formField={formFields.image}
          hasError={hasError(formFields.image)}
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
          Create Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
