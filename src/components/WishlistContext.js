import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
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

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
