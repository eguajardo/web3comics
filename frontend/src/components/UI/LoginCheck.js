function LoginCheck(props) {
  return (
    <div>{(!props.idx || !props.idx.id) && <div>Please Login first</div>}</div>
  );
}

export default LoginCheck;
