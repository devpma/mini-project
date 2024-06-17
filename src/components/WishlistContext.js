import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
        setWishlist(wishlistData);
      } catch (error) {}
    } else {
      setWishlist([]);
    }
  }, []);

  const addToWishlist = useCallback(
    async (movieId, title, voteAverage, backdropPath) => {
      const user = auth.currentUser;
      if (user) {
        try {
          const wishlistRef = collection(db, "users", user.uid, "wishlist");
          const q = query(wishlistRef, where("movieId", "==", movieId));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            await addDoc(wishlistRef, {
              movieId,
              title,
              voteAverage,
              backdropPath,
            });
            await fetchWishlist();
          } else {
          }
        } catch (error) {}
      }
    },
    [fetchWishlist]
  );

  const removeFromWishlist = useCallback(
    async (movieId) => {
      const user = auth.currentUser;
      if (user) {
        try {
          const wishlistRef = collection(db, "users", user.uid, "wishlist");
          const q = query(wishlistRef, where("movieId", "==", movieId));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          await fetchWishlist();
        } catch (error) {}
      }
    },
    [fetchWishlist]
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchWishlist();
    });
    return () => unsubscribe(); // Unsubscribe 함수 호출
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
