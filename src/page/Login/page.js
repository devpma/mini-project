import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../../firebase"; // Firebase 초기화 설정 경로
import { useAuth } from "../../components/AuthContext"; // AuthContext 경로를 맞게 수정
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });
  }, [auth, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Firebase Authentication을 통해 사용자를 로그인
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // 로그인 성공 시 홈 페이지로 이동
    } catch (error) {
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
    }
  };

  const handleAuth = () => {
    signInWithPopup(auth, provider);
  };

  return (
    <>
      <form className="input-wrap login-wrap" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="text"
          className="input"
          placeholder="아이디를 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="alert">{error}</p>}
        <div className="btn-wrap">
          <button type="submit">로그인</button>
        </div>
        <p className="form-btm-txt">
          아직 회원이 아니신가요? <Link to="/signup">회원가입하기</Link>
        </p>
        <div class="sns-login">
          <ul>
            <li class="google">
              <button onClick={handleAuth}>google</button>
            </li>
          </ul>
        </div>
      </form>
    </>
  );
};

export default Login;
