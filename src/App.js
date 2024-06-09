import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MainPage from "./page/Main/page";
import Signup from "./page/Signup/page";
import Login from "./page/Login/page";
import Layout from "./page/Layout/Layout";
import Searchpage from "./page/Search/page";
import Wishlist from "./page/Wishlist/page";
import { useState, useEffect } from "react";
import { auth } from "./firebase"; // Firebase 인증 객체를 가져옵니다
import { AuthProvider } from "./components/AuthContext";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  // 로그인 상태를 토글하는 함수
  function handleLoginStatus() {
    setIsLogged((prev) => !prev);
  }

  // Firebase 인증 상태 변경 감지를 위해 useEffect 사용
  useEffect(() => {
    // Firebase 초기화 코드 (예시)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              element={
                <Layout
                  loginStatus={isLogged}
                  handleLoginStatus={handleLoginStatus}
                />
              }
            >
              <Route path="/" element={<MainPage />} />
              <Route path="/:id" element={<MovieDetail />} />
              <Route
                path="/login"
                element={<Login handleLoginStatus={handleLoginStatus} />}
              />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/search" element={<Searchpage />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
