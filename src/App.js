import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MainPage from "./page/Main/page";
import Signup from "./page/Signup/page";
import Login from "./page/Login/page";
import Layout from "./page/Layout/Layout";
import Searchpage from "./page/Search/page";
import Wishlist from "./page/Wishlist/page";
import { AuthProvider } from "./components/AuthContext";
import { WishlistProvider } from "./components/WishlistContext";

function App() {
  return (
    <>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/:id" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/search" element={<Searchpage />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>
            </Routes>
          </Router>
        </WishlistProvider>
      </AuthProvider>
    </>
  );
}

export default App;
