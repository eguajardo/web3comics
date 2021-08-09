import { useState } from "react";
import { useFormFields } from "../hooks/useFormFields";
import { useProfile } from "../hooks/useProfile";

import LoginCheck from "../components/UI/LoginCheck";
import PageContainer from "../components/Layout/PageContainer";
import FormGroup from "../components/UI/FormGroup";
import SubmitButton from "../components/UI/SubmitButton";

function NewComic() {
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

          <SubmitButton>Create Comic</SubmitButton>
        </form>
      )}
      <LoginCheck idx={idx} />
    </PageContainer>
  );
}

export default NewComic;
