import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieCard.css";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";

const MovieCard = ({ id, title, score, img }) => {
  const { user } = useAuth();
  const { wishlist, fetchWishlist } = useWishlist();
  const [isWish, setIsWish] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState(null);

  const fetchWishlistStatus = useCallback(() => {
    if (user && wishlist) {
      const wishItem = wishlist.find((item) => item.movieId === id);
      if (wishItem) {
        setIsWish(true);
        setWishlistDocId(wishItem.id);
      } else {
        setIsWish(false);
        setWishlistDocId(null);
      }
      console.log("Fetched wishlist status:", { isWish, wishlistDocId });
    }
  }, [user, wishlist, id]);

  useEffect(() => {
    fetchWishlistStatus();
  }, [fetchWishlistStatus]);

  const addToWishlist = async () => {
    if (user) {
      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "wishlist"),
          {
            movieId: id,
            name: title,
            score,
            imageUrl: `${imgBasePath}${img}`,
          }
        );
        await fetchWishlist();
        setWishlistDocId(docRef.id);
        setIsWish(true);
        console.log("Added to wishlist:", docRef.id);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const removeFromWishlist = async () => {
    if (user && wishlistDocId) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
        await fetchWishlist();
        setWishlistDocId(null);
        setIsWish(false);
        alert("위시리스트에서 제거되었습니다.");
        console.log("Removed from wishlist:", wishlistDocId);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  const handleOnWishlist = async () => {
    if (isWish) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
  };

  return (
    <div className="list-box">
      {!img ? (
        <div className="img empty"></div>
      ) : (
        <Link to={`/${id}`} className="img">
          <img src={`${imgBasePath}${img}`} alt={title} />
        </Link>
      )}
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>
        <button
          className={`wish ${isWish ? "active" : ""}`}
          onClick={handleOnWishlist}
        >
          {isWish === null ? "⌛" : isWish ? "좋아요" : "추가"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
