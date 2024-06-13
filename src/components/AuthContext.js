// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase"; // firebase 초기화 설정 경로

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLogged, setIsLogged] = useState(false);
  // 로그인 상태를 토글하는 함수
  function handleLoggedIn() {
    setIsLogged((prev) => !prev);
  }
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
