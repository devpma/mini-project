import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      navigate(`/search?keyword=${value}`);
    } else {
      navigate(`/`);
    }
  };

  const handleMenuSearch = (e) => {
    const value = e.target.value;
    setMenuSearch(value);
    if (value) {
      navigate(`/search?keyword=${value}`);
    } else {
      navigate(`/`);
      window.location.reload();
    }
  };

  const handleMenuClick = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={`navbar ${isActive ? "active" : ""}`}>
      <div className="navbar-logo">
        <Link to="/">HOME</Link>
      </div>
      <div className="search-wrap">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="검색어를 입력하세요."
        />
      </div>
      <div className="navbar-links">
        <ThemeToggler />
        <button>
          <Link to="/login">LOGIN</Link>
        </button>
        <button>
          <Link to="/Signup" className="btn-signup">
            SIGN UP
          </Link>
        </button>
        <div className="nav-btn" onClick={handleMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="nav-menu">
        <ul className="menu">
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
          <li>
            <Link to="/Signup">SIGNUP</Link>
          </li>
        </ul>
        <div className="search-wrap">
          <input
            type="text"
            value={menuSearch}
            onChange={handleMenuSearch}
            placeholder="검색어를 입력하세요."
          />
        </div>
      </div>
    </nav>
  );
};

const ThemeToggler = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "다크 모드" : "라이트 모드"}
    </button>
  );
};

export default NavBar;
