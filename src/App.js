import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MainPage from "./page/Main/page";
import Signup from "./page/Signup/page";
import Login from "./page/Login/page";
import Layout from "./page/Layout/Layout";
import Searchpage from "./page/Search/page";
import styled from "styled-components";
const StyledPrimary = styled.div({
  color: "var(--colors-primary)",
  backgroundColor: "var(--colors-background)",
});

function App() {
  return (
    <>
      <StyledPrimary>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/search" element={<Searchpage />} />
            </Route>
          </Routes>
        </Router>
      </StyledPrimary>
    </>
  );
}

export default App;
