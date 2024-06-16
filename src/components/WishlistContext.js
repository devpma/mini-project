// WishlistContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // const fetchWishlist = async () => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const wishlistRef = collection(db, "users", user.uid, "wishlist");
  //     const wishlistSnapshot = await getDocs(wishlistRef);
  //     const wishlistData = wishlistSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setWishlist(wishlistData);
  //   }
  // };
  // let cachedWishlist = null;
  let cachedWishlist = null;

  const fetchWishlist = async () => {
    if (cachedWishlist) {
      return cachedWishlist;
    }
    const user = auth.currentUser;
    if (user) {
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistRef);
      cachedWishlist = wishlistSnapshot.docs.map((doc) => ({
        id: doc.id,
        movieId: doc.data().movieId,
        ...doc.data(),
      }));
      return cachedWishlist;
    }
    return [];
  };

  const addToWishlist = async (movieId, title, voteAverage, backdropPath) => {
    const user = auth.currentUser;
    if (user) {
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      await addDoc(wishlistRef, {
        movieId,
        title,
        voteAverage,
        backdropPath,
      });
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const q = query(wishlistRef, where("movieId", "==", movieId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      fetchWishlist();
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
