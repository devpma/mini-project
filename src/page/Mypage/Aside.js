import React from "react";

const Aside = ({ user, handleNavMenu }) => {
  const spliceUserEmail = (email) => {
    const username = email.split("@")[0];
    return username;
  };

  return (
    <aside className="myinfo-wrap">
      <div className="img">
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="profile img" />
        ) : (
          <img src="../images/icon-user-big.png" alt="profile img" />
        )}
      </div>
      <div className="userinfo">
        <p className="name">
          {user && <strong>{spliceUserEmail(user.email)}</strong>}&nbsp;님
        </p>
      </div>
      <div className="mypage-menu-wrap">
        <ul>
          <li>
            <button onClick={handleNavMenu}>회원정보</button>
          </li>
          <li>
            <button onClick={handleNavMenu}>나의 리뷰</button>
          </li>
          <li>
            <button onClick={handleNavMenu}>위시리스트</button>
          </li>
          <li>
            <button onClick={handleNavMenu}>고객센터</button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
