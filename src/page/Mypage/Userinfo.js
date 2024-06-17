import React from "react";
import { useAuth } from "../../components/AuthContext";

const Userinfo = () => {
  const { user } = useAuth(); // useAuth 훅에서 가져온 user 객체
  console.log(user);
  return (
    <div className="Userinfo-wrap">
      <h1>MY PAGE</h1>
      <div className="userinfo-box">
        {user ? (
          <>
            <div className="title">이메일</div>
            <div className="cont"></div>
          </>
        ) : (
          <>
            <div className="title">이름</div>
            <div className="cont"></div>
          </>
        )}
        <div className="title">마지막 로그인</div>
        <div className="cont"></div>
      </div>
    </div>
  );
};

export default Userinfo;
