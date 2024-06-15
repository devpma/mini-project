import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (user) {
      try {
        console.log("Fetching wishlist for user:", user.uid);
        const q = query(collection(db, "users", user.uid, "wishlist"));
        const querySnapshot = await getDocs(q);
        const wishlistData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Wishlist data fetched:", wishlistData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (movieId, name, score, imageUrl) => {
    if (!user) return;
    console.log("Adding to wishlist:", { movieId, name, score, imageUrl });

    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/wishlist`),
        {
          movieId,
          name,
          score,
          imageUrl,
        }
      );
      setWishlist((prev) => [
        ...prev,
        { id: docRef.id, movieId, name, score, imageUrl },
      ]);
      console.log("Added to wishlist:", docRef.id);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (movieId) => {
    if (!user) return;
    console.log("Removing from wishlist:", { movieId });

    try {
      const wishItem = wishlist.find((item) => item.movieId === movieId);
      if (wishItem) {
        await deleteDoc(doc(db, `users/${user.uid}/wishlist`, wishItem.id));
        setWishlist((prev) => prev.filter((item) => item.movieId !== movieId));
        console.log("Removed from wishlist:", wishItem.id);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
