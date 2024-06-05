import React from "react";
import "./style.css";

const Login = () => {
  return (
    <>
      <form className="input-wrap login-wrap">
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
        <p className="form-btm-txt">
          아직 회원이 아니신가요? <a href="/Signup">회원가입하기</a>
        </p>
      </form>
    </>
  );
};

export default Login;
