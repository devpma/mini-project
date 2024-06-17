import { useEffect, useState } from "react";
import { imgBasePath } from "../../components/constant";
import { getAuth } from "firebase/auth";
import { app, db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useAuth } from "../../components/AuthContext";
import { Navigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // useAuth 훅에서 가져온 user 객체

  useEffect(() => {
    console.log("User:", user); // user 객체 로그 출력

    const fetchWishlist = async () => {
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const wishlistRef = collection(
            db,
            "users",
            currentUser.uid,
            "wishlist"
          );
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
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }

    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener("wishlist-update", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlist-update", handleWishlistUpdate);
    };
  }, [user]);

  const removeFromWishlist = async (itemId) => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const itemDoc = doc(db, "users", currentUser.uid, "wishlist", itemId);
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
      <h1>WISHLIST</h1>
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
                      onClick={() => Navigate(`/${item.movieId}`)}
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
