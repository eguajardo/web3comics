function ActionsContainer(props) {
  return (
    <div>
      <div className="container actions-container">
        <div id="actions" className="mb-3 d-flex flex-row-reverse">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default ActionsContainer;
