import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard";
import axios from "axios";
import useQuery from "../../hooks/useQuery";
import { useDebounce } from "../../hooks/useDebounce";
import { useWishlist } from "../../components/WishlistContext";

const SearchPage = () => {
  const query = useQuery();
  const [searchResults, setSearchResults] = useState([]);
  const searchTerm = query.get("keyword");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { wishlist } = useWishlist();

  const fetchSearchData = async (searchTerm) => {
    try {
      const apiKey = process.env.REACT_APP_MY_API;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${searchTerm}`;
      const response = await axios.get(url);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchData(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="list-wrap">
      {searchResults.map((movie) => {
        const isWish = wishlist.some((item) => item.movieId === movie.id);
        return (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            img={movie.poster_path}
            score={movie.vote_average}
            isWish={isWish}
          />
        );
      })}
    </div>
  );
};

export default SearchPage;
