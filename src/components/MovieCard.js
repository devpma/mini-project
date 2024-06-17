import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { imgBasePath } from "./constant";
import { useWishlist } from "./WishlistContext";
import "./MovieCard.css";

const MovieCard = ({ id, title, score, img, containerclass }) => {
  const { wishlist, addToWishlist, removeFromWishlist, fetchWishlist } =
    useWishlist();
  const [loading, setLoading] = useState(false);
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    const wishItem = wishlist.find((item) => item.movieId === id);
    setIsWish(!!wishItem);
  }, [wishlist, id]);

  const handleToggleWishlist = async () => {
    setLoading(true);
    if (isWish) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id, title, score, img);
    }
    await fetchWishlist();
    window.dispatchEvent(new Event("wishlist-update"));
    setLoading(false);
  };

  return (
    <div className={`list-box ${containerclass || ""}`}>
      {!img ? (
        <Link to={`/${id}`} className="img empty"></Link>
      ) : (
        <Link to={`/${id}`} className="img">
          <img src={`${imgBasePath}${img}`} alt={title} />
        </Link>
      )}
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>
        <button
          className={`wish ${loading ? "loading" : isWish ? "active" : ""}`}
          onClick={handleToggleWishlist}
          disabled={loading}
        >
          {loading ? "⌛" : isWish ? "좋아요" : "추가"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
