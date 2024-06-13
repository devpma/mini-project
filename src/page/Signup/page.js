import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // firebase.js에서 auth를 가져옴
import "./style.css";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birth, setBirth] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // 유효성 검사는 사용자 입력 데이터를 검증하여 올바른 형식인지 확인하고, 잠재적인 오류나 보안 문제를 방지하는 과정
  const validate = () => {
    const newErrors = {};
    if (!userId) {
      newErrors.userId = "아이디를 입력하세요. (test@email.com)";
    } else if (!/\S+@\S+\.\S+/.test(userId)) {
      newErrors.userId = "유효한 아이디를 입력하세요.";
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    if (password !== checkPassword) {
      newErrors.checkPassword = "비밀번호는 일치해야합니다.";
    }
    if (!birth || birth.length !== 8) {
      newErrors.birth = "정확한 생년월일을 입력해 주세요. (8자리)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 폼 입력 값의 유효성을 검사하는 함수
    if (validate()) {
      try {
        // Firebase Authentication을 통해 새로운 사용자를 생성 // 비동기적으로 사용자 생성 작업이 완료될 때까지 기다림
        await createUserWithEmailAndPassword(auth, userId, password);
        setSuccess(true);
        navigate("/login");
      } catch (error) {
        console.error(error);
        setErrors({ form: error.message });
      }
    }
  };

  return (
    <>
      <form className="input-wrap join-wrap" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <input
          type="text"
          className="input"
          placeholder="이메일을 입력하세요."
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        {errors.userId && <p className="alert">{errors.userId}</p>}
        <input
          type="password"
          className="input"
          placeholder="비밀번호를 입력하세요."
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="alert">{errors.password}</p>}
        <input
          type="password"
          className="input"
          placeholder="비밀번호를 재입력하세요."
          required
          onChange={(e) => setCheckPassword(e.target.value)}
        />
        {errors.checkPassword && (
          <p className="alert">{errors.checkPassword}</p>
        )}
        <input
          type="text"
          className="input"
          placeholder="이름을 입력하세요."
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="생년월일을 입력하세요. (19900101)"
          required
          onChange={(e) => setBirth(e.target.value)}
        />
        {errors.birth && <p className="alert">{errors.birth}</p>}
        {errors.form && <p className="alert">{errors.form}</p>}
        <div className="btn-wrap">
          <button type="button">취소</button>
          <button type="submit">가입</button>
        </div>
        <p className="form-btm-txt">
          이미 가입하셨나요? <Link to="/login">로그인하기</Link>
        </p>
      </form>
    </>
  );
};

export default Signup;
