import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <>
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
        <div className="btn-wrap">
          <button>로그인</button>
        </div>
      </div>
    </>
  );
};

export default Login;
