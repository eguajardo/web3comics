import { toGatewayURL } from "nft.storage";

function FormGroup(props) {
  let className =
    props.formField.type === "file" ? "form-control-file" : "form-control";

  if (props.hasError) {
    className += " is-invalid";
  }

  let previewSrc = props.previewSrc;
  if (props.formField.enteredFiles && props.formField.enteredFiles[0]) {
    previewSrc = URL.createObjectURL(props.formField.enteredFiles[0]);
  } else if (previewSrc) {
    previewSrc = toGatewayURL(props.previewSrc);
  }

  return (
    <div className="form-group">
      <label htmlFor={props.formField.id}>{props.formField.label}</label>
      {previewSrc && (
        <div>
          <img
            accept="image/*"
            src={previewSrc}
            alt="Profile"
            className="mb-4"
          />
        </div>
      )}
      <input
        type={props.formField.type}
        name={props.formField.id}
        id={props.formField.id}
        onChange={props.valueChangeHandler}
        onBlur={props.inputBlurHandler}
        value={props.formField.value}
        placeholder={props.formField.placeholder}
        className={className}
      />
      <div className="invalid-feedback">{props.hasError}</div>
    </div>
  );
}

export default FormGroup;
