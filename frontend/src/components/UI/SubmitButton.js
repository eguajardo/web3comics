function SubmitButton(props) {
  return (
    <button
      name="submit"
      className="btn btn-primary btn-lg btn-block"
      disabled={props.formProcessing}
    >
      {props.children}
      {props.formProcessing && (
        <span>
          <span
            className="spinner-grow spinner-grow-sm ml-2 mb-1"
            role="status"
            aria-hidden="true"
          ></span>
          <span
            className="spinner-grow spinner-grow-sm ml-2 mb-1"
            role="status"
            aria-hidden="true"
          ></span>
          <span
            className="spinner-grow spinner-grow-sm ml-2 mb-1"
            role="status"
            aria-hidden="true"
          ></span>
        </span>
      )}
    </button>
  );
}

export default SubmitButton;
