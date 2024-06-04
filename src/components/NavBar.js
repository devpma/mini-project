import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    Navigate(`/search?q=${e.target.value}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏠</Link>
      </div>
      <div className="search-wrap">
        <input type="text" onChange={handleSearch} />
      </div>
      <div className="navbar-links">
        <button>
          <Link to="/login">LOGIN</Link>
        </button>
        <button>
          <Link to="/Signup">SIGN UP</Link>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
