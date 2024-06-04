import React from "react";
import NavBar from "../components/NavBar";
import "./Login.css";

const Login = () => {
  return (
    <>
      <NavBar />
      <div className="input-wrap login-wrap">
        <h1>Login</h1>
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
      </div>
    </>
  );
};

export default Login;
