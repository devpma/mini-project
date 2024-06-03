import "./App.css";
import { Router, Route, Routes } from "react-router-dom";

import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";

import movieListData from "./mockData/mockData.json";
import movieDetailData from "./mockData/movieDetailData.json";
import { useEffect, useState } from "react";

function App() {
  const [movie, setMovie] = useState([]);
  const [movieDetail, setMovieDetail] = useState({});

  useEffect(() => {
    setMovie(movieListData.results);
    setMovieDetail(movieDetailData);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <div className="list-wrap">
              {movie.map((item) => (
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
        <Route path="/:id" element={<MovieDetail movieList={movieDetail} />} />
      </Routes>
    </div>
  );
}

export default App;
