import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase"; // firebase.js에서 auth를 가져옵니다
import { useAuth } from "./AuthContext"; // AuthContext 경로를 맞게 수정

const NavBar = ({ handleDarkMode }) => {
  const auth = getAuth(app);
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const spliceUserEmail = (email) => {
    const username = email.split("@")[0];
    return username;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      navigate(`/search?keyword=${value}`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      setSearch("");
    }
  }, [pathname]);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
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
      <div className="navbar-links logged-in">
        {!user ? (
          <NavLogged />
        ) : (
          <NavLogin
            user={user}
            spliceUserEmail={spliceUserEmail}
            handleLogout={handleLogout}
          />
        )}
        <div className="nav-btn" onClick={handleMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="nav-menu">
        {!user ? (
          <NavLogged />
        ) : (
          <NavLogin
            user={user}
            spliceUserEmail={spliceUserEmail}
            handleLogout={handleLogout}
          />
        )}
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

export default NavBar;

const NavLogged = () => {
  return (
    <ul className="menu navbar-links">
      <li>
        <Link to="/login">LOGIN</Link>
      </li>
      <li>
        <Link to="/signup" className="btn-signup">
          SIGNUP
        </Link>
      </li>
    </ul>
  );
};

const NavLogin = ({ user, spliceUserEmail, handleLogout }) => {
  return (
    <>
      <p className="user-info">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" />
        ) : (
          <>
            <span>
              <strong>{spliceUserEmail(user.reloadUserInfo.email)}</strong>님
              &nbsp;
            </span>
            <br />
            어서오세요!
          </>
        )}
      </p>
      <div className="logged-in-dropdown">
        <button onClick={handleLogout}>SIGN OUT</button>
        <button>
          <Link to="/wishlist">WISH LIST</Link>
        </button>
      </div>
    </>
  );
};
