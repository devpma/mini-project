import React from "react";
import NavBar from "../components/NavBar";
import "./Signup.css";

const Signup = () => {
  return (
    <>
      <NavBar />
      <div className="input-wrap join-wrap">
        <h1>Signup</h1>
        <input
          type="text"
          className="input"
          placeholder="아이디를 입력하세요."
          required
        />
        <input
          type="password"
          className="input"
          placeholder="비밀번호를 입력하세요."
          required
        />
        <input
          type="password"
          className="input"
          placeholder="비밀번호를 재입력하세요."
          required
        />
        <input
          type="text"
          className="input"
          placeholder="이름을 입력하세요."
          required
        />
        <input
          type="text"
          className="input"
          placeholder="생년월일을 입력하세요. (1990909)"
          required
        />
        <div className="btn-wrap">
          <button>취소</button>
          <button>가입</button>
        </div>
      </div>
    </>
  );
};

export default Signup;
