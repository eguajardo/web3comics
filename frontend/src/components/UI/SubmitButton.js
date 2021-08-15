import LoadingDots from "./LoadingDots";

function SubmitButton(props) {
  return (
    <button
      name="submit"
      className={
        props.className ? props.className : "btn btn-primary btn-lg btn-block"
      }
      disabled={props.formProcessing}
    >
      {props.children}
      {props.formProcessing && <LoadingDots />}
    </button>
  );
}

export default SubmitButton;
