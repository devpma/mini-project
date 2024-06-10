import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./style.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistRef);
        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWishlistItems(wishlistData);
      } catch (error) {
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
        const itemDoc = doc(db, "users", user.uid, "wishlist", itemId);
        await deleteDoc(itemDoc);
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        window.dispatchEvent(new Event("wishlist-update"));
      } catch (error) {}
    } else {
      console.log("User not authenticated");
    }
  };

  return (
    <div className="wishlist-wrap">
      <h1>WISH LIST</h1>
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
                  <div className="img">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="info">
                    <p className="title">{item.name}</p>
                    <p className="score">⭐️ {item.score}</p>
                    <button
                      className={`wish liked`}
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      🩷
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
