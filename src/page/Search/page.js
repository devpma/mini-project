import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard";
import axios from "axios";
import useQuery from "../../hooks/useQuery";
import { useDebounce } from "../../hooks/useDebounce";

const Searchpage = ({ id, title, score, img }) => {
  const query = useQuery();
  const [searchResults, setSearchResults] = useState([]);
  const searchTerm = query.get("keyword");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchSearchData = async (searchTerm) => {
    try {
      const apiKey = process.env.REACT_APP_MY_API;

      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${searchTerm}`;
      const response = await axios.get(url);

      setSearchResults(response.data.results);
    } catch (error) {
      console.error(`Error fetching movie data: ${error.message}`);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchData(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="list-wrap">
      {searchResults.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          img={movie.poster_path}
          score={movie.vote_average}
        />
      ))}
    </div>
  );
};

export default Searchpage;
