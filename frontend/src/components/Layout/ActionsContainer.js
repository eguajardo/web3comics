function ActionsContainer(props) {
  return (
    <div>
      <div className="container actions-container">
        <div id="actions" className="mb-3 text-right">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default ActionsContainer;
