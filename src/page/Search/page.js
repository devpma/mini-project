import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../../components/MovieCard";
import axios from "axios";
import useQuery from "../../hooks/useQuery";
import { useDebounce } from "../../hooks/useDebounce";
import { useWishlist } from "../../components/WishlistContext";

const SearchPage = () => {
  const query = useQuery();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTerm = query.get("keyword");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { wishlist, fetchWishlist } = useWishlist();

  const fetchSearchData = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_MY_API;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${searchTerm}`;
      const response = await axios.get(url);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchData(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchSearchData]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="list-wrap">
      {loading ? (
        <div className="loading">
          <span className="loader"></span>
        </div>
      ) : searchResults.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        searchResults.map((movie) => {
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
        })
      )}
    </div>
  );
};

export default SearchPage;
