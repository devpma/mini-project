import React, { useState } from "react";
import "./style.css";
import { useAuth } from "../../components/AuthContext";
import Aside from "./Aside";
import Userinfo from "./Userinfo";
import Wishlist from "./Wishlist";
import Myreview from "./Myreview";
import CScenter from "./CScenter";

const Mypage = () => {
  const { user } = useAuth(); // useAuth 훅에서 가져온 user 객체
  const [clickedNavMenu, setClickedNavMenu] = useState("회원정보");

  function handleNavMenu(e) {
    setClickedNavMenu(e.currentTarget.innerText);
  }

  function switchContentDunToNavMenu(menu) {
    switch (menu) {
      case "회원정보":
        return <Userinfo />;
      case "나의 리뷰":
        return <Myreview />;
      case "위시리스트":
        return <Wishlist />;
      case "고객센터":
        return <CScenter />;
      default:
        return <Userinfo />;
    }
  }

  return (
    <div className="mypage-wrap">
      <Aside user={user} handleNavMenu={handleNavMenu} />
      <div className="content">{switchContentDunToNavMenu(clickedNavMenu)}</div>
    </div>
  );
};

export default Mypage;
