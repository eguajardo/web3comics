function FormGroup(props) {
  let className =
    props.formField.type === "file" ? "form-control-file" : "form-control";

  if (props.hasError) {
    className += " is-invalid";
  }

  return (
    <div className="form-group">
      <label htmlFor={props.formField.id}>{props.formField.label}</label>
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
