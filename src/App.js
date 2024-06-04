import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MainPage from "./page/Mainpage";
import Signup from "./page/Signup";
import Login from "./page/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
