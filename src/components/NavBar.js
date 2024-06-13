import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase"; // firebase.js에서 auth를 가져옵니다
import { useAuth } from "./AuthContext"; // AuthContext 경로를 맞게 수정
import { collection } from "firebase/firestore";

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
        <Link to="/">MOVIE</Link>
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
        <Link to="/wishlist">
          {user.photoURL ? (
            <img src={user.photoURL} alt="profile img" />
          ) : (
            <img src="../images/icon-user.png" alt="profile img" />
          )}
        </Link>
        <span>
          <strong>{spliceUserEmail(user.reloadUserInfo.email)}</strong>&nbsp;님
        </span>
      </p>
      <button onClick={handleLogout} className="btn-signout">
        SIGN OUT
      </button>
    </>
  );
};
