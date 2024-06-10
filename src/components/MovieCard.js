import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieCard.css";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const MovieCard = ({ id, title, score, img }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWish, setIsWish] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState(null);

  const fetchWishlistStatus = useCallback(async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "users", user.uid, "wishlist"),
          where("movieId", "==", id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          setIsWish(true);
          setWishlistDocId(docId);
        } else {
          setIsWish(false);
          setWishlistDocId(null);
        }
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    } else {
    }
  }, [id, user]);

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
        setWishlistDocId(docRef.id);
        window.dispatchEvent(new Event("wishlist-update"));
        setIsWish(true);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    } else {
      console.log("User not authenticated");
    }
  };

  const removeFromWishlist = async () => {
    if (user && wishlistDocId) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
        console.log("Movie removed from wishlist");
        setWishlistDocId(null);
        window.dispatchEvent(new Event("wishlist-update"));
        setIsWish(false);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
    }
  };

  const handleOnWishlist = async () => {
    if (isWish) {
      await removeFromWishlist();
    } else if (user && !isWish) {
      await addToWishlist();
    } else {
      alert("로그인이 필요합니다.");
    }
    // 상태 변경 후의 상태 확인
    setTimeout(() => {}, 500);
  };

  return (
    <div className="list-box">
      {img === null ? (
        <div className="img empty"></div>
      ) : (
        <div className="img" onClick={() => navigate(`/${id}`)}>
          <img src={`${imgBasePath}${img}`} alt={title} />
        </div>
      )}
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>

        <button
          className={`wish ${isWish ? "liked" : "unliked"}`}
          onClick={handleOnWishlist}
        >
          {isWish === null ? "⌛" : isWish ? "🩷" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
