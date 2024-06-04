import React from "react";
import MovieCard from "../components/MovieCard";

const Searchpage = () => {
  return (
    <>
      <div className="list-wrap">
        {searchMovies.map((movie) => (
          <MovieCard />
        ))}
      </div>
    </>
  );
};

export default Searchpage;
