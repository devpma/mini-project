import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
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
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (movieId, title, voteAverage, backdropPath) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        await addDoc(wishlistRef, {
          movieId,
          title,
          voteAverage,
          backdropPath,
        });
        fetchWishlist();
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };

  const removeFromWishlist = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const q = query(wishlistRef, where("movieId", "==", movieId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        fetchWishlist();
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
  };
};

export default useWishlist;
