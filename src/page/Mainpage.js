import { useCallback, useEffect, useState } from "react";
import instance from "../api/axios";
import MovieCard from "../components/MovieCard";
import requests from "../api/request";
import NavBar from "../components/NavBar";

function MainPage() {
  const [movies, setMovies] = useState([]);

  const fetchMovieData = useCallback(async () => {
    try {
      const response = await instance.get(requests.fetchMovieList);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);
  return (
    <>
      <NavBar />
      <div className="list-wrap">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            img={movie.poster_path}
            score={movie.vote_average}
            fetchUrl={requests.fetchMovieList}
          />
        ))}
      </div>
    </>
  );
}

export default MainPage;
