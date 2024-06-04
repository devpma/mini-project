import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Home</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <button>
            <Link to="/login">Login</Link>
          </button>
        </li>
        <li>
          <button>
            <Link to="/Signup">Signup</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
