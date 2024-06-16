import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./style.css";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        console.log("Fetching wishlist for user:", user.uid);
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistRef);
        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          movieId: doc.data().movieId,
          ...doc.data(),
        }));
        console.log("Fetched wishlist data:", wishlistData);
        setWishlistItems(wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("User not authenticated");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }

    const handleWishlistUpdate = () => {
      fetchWishlist();
    };
    window.addEventListener("wishlist-update", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-update", handleWishlistUpdate);
    };
  }, [fetchWishlist]);

  const removeFromWishlist = async (itemId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        console.log("Removing item from wishlist:", itemId);
        const itemDoc = doc(db, "users", user.uid, "wishlist", itemId);
        await deleteDoc(itemDoc);
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        window.dispatchEvent(new Event("wishlist-update"));
      } catch (error) {
        console.error("Error removing item from wishlist:", error);
      }
    }
  };

  return (
    <div className="wishlist-wrap">
      <h1>MYPAGE</h1>
      {loading ? (
        <div className="loading">
          <span className="loader"></span>
        </div>
      ) : (
        <div>
          <ul className="list-wrap">
            {wishlistItems.length === 0 ? (
              <div className="no-data">
                <div>위시리스트에 담긴 영화가 없습니다.</div>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <li key={item.id} className="list-box">
                  <div
                    className="img"
                    onClick={() => navigate(`/${item.movieId}`)}
                  >
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="info">
                    <p className="title">{item.title}</p>
                    <p className="score">⭐️ {item.score}</p>
                    <button
                      className="wish active"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      좋아요
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
