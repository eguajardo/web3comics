import { useProfile } from "../../hooks/useProfile";
import { useEthers } from "@usedapp/core";

import { NavLink } from "react-router-dom";
import AccountButton from "../UI/AccountButton";

function Navbar() {
  const { idx } = useProfile();
  const { account } = useEthers();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <NavLink
            id="new-link"
            className="nav-item nav-link"
            activeClassName="active"
            to="/"
          >
            Browse Comics
          </NavLink>
          {account && (
            <NavLink
              id="new-link"
              className="nav-item nav-link"
              activeClassName="active"
              to="/collection"
            >
              My collection
            </NavLink>
          )}
          {idx && idx.id && (
            <NavLink
              id="new-link"
              className="nav-item nav-link"
              activeClassName="active"
              to={`/${idx.id}`}
            >
              Publish
            </NavLink>
          )}
          <div className="navbar-nav ml-auto">
            <AccountButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
