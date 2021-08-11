import { NavLink } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";

import LoginButton from "../UI/LoginButton";

function Navbar() {
  const { idx } = useProfile();

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
          {idx && idx.id && (
            <NavLink
              id="new-link"
              className="nav-item nav-link"
              activeClassName="active"
              to={`/${idx.id}`}
            >
              My Creations
            </NavLink>
          )}
          <div className="navbar-nav ml-auto">
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
