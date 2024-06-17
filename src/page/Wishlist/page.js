import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { imgBasePath } from "../../components/constant"; // 절대 경로로 수정

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistRef);
        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          movieId: doc.data().movieId,
          title: doc.data().title,
          voteAverage: doc.data().voteAverage,
          backdropPath: doc.data().backdropPath,
        }));
        setWishlistItems(wishlistData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
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
              wishlistItems.map((item) => {
                const imageUrl = item.backdropPath
                  ? `${imgBasePath}${item.backdropPath}`
                  : null;
                return (
                  <li key={item.id} className="list-box">
                    <div
                      className={`img ${!imageUrl ? "empty" : ""}`}
                      onClick={() => navigate(`/${item.movieId}`)}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.title} />
                      ) : null}
                    </div>
                    <div className="info">
                      <p className="title">{item.title}</p>
                      <p className="score">⭐️ {item.voteAverage}</p>
                      <button
                        className="wish active"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        좋아요
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
