import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";

import movieListData from "./mockData/mockData.json";
import movieDetailData from "./mockData/movieDetailData.json";

function App() {
  const movieListPageData = movieListData.results;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="list-wrap">
                {movieListPageData.map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    img={item.poster_path}
                    title={item.title}
                    score={item.vote_average}
                  />
                ))}
              </div>
            }
          />
          <Route
            path="/:id"
            element={<MovieDetail movieList={movieDetailData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
