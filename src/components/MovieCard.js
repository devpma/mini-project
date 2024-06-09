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
  const [isWish, setIsWish] = useState(null);
  const [wishlistDocId, setWishlistDocId] = useState(null);

  // 사용자가 특정 영화에 대해 위시리스트에 추가했는지 여부를 확인하는 함수
  // 캐시된 데이터를 먼저 확인하고, 없으면 Firestore에서 데이터를 가져와서 상태를 업데이트
  const fetchWishlistStatus = useCallback(async () => {
    if (user) {
      const cachedWish = localStorage.getItem(`wishlist-${user.uid}-${id}`); // 로컬 저장소에서 wishlist-${user.uid}-${id} 키로 저장된 캐시된 데이터를 가져옴
      if (cachedWish) {
        const parsedWish = JSON.parse(cachedWish); // 캐시된 데이터가 있으면 이를 파싱하여 isWish와 wishlistDocId 상태를 설정
        setIsWish(parsedWish.isWish);
        setWishlistDocId(parsedWish.wishlistDocId);
        return; // 캐시된 데이터가 있으면 Firestore에서 데이터를 가져오지 않고 함수가 종료
      }

      try {
        // 사용자의 위시리스트에서 특정 영화(movieId가 id와 일치하는)를 찾기 위한 쿼리를 작성
        const q = query(
          collection(db, "users", user.uid, "wishlist"),
          where("movieId", "==", id)
        );
        const querySnapshot = await getDocs(q); // 쿼리를 실행하고, 결과를 querySnapshot에 저장
        // 해당 영화가 위시리스트에 있는 경우
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; // 첫 번째 문서의 ID를 가져와 docId에 저장
          setIsWish(true); // 해당 영화가 위시리스트에 있음을 나타내는 상태를 설정
          setWishlistDocId(docId); // 해당 문서의 ID를 상태로 설정
          localStorage.setItem(
            `wishlist-${user.uid}-${id}`,
            JSON.stringify({ isWish: true, wishlistDocId: docId }) // 이 데이터를 로컬 저장소에 캐시
          );
          //해당 영화가 위시리스트에 없는 경우
        } else {
          setIsWish(false); // 해당 영화가 위시리스트에 없음을 나타내는 상태를 설정
          setWishlistDocId(null); // 문서 ID를 null로 설정
          localStorage.setItem(
            `wishlist-${user.uid}-${id}`,
            JSON.stringify({ isWish: false, wishlistDocId: null }) // 이 상태를 로컬 저장소에 캐시
          );
        }
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
        setIsWish(false); // 해당 영화가 위시리스트에 없음을 나타내는 상태를 설정
      }
    }
  }, [id, user]); // 함수가 의존성 배열(id와 user)이 변경될 때만 재생성

  useEffect(() => {
    fetchWishlistStatus();
  }, [fetchWishlistStatus]); //컴포넌트가 마운트될 때와 fetchWishlistStatus 함수가 변경될 때 실행

  const addToWishlist = async () => {
    if (user) {
      try {
        // Firestore에 새로운 문서를 추가
        // await addDoc : 문서가 추가될 때까지 비동기적으로 기다리고, 문서의 참조(docRef)를 반환
        const docRef = await addDoc(
          collection(db, "users", user.uid, "wishlist"), // 사용자의 위시리스트 컬렉션에 문서를 추가
          {
            movieId: id,
            name: title,
            score,
            imageUrl: `${imgBasePath}${img}`,
          } // 문서에 포함되는 것들
        );
        setIsWish(true); // 영화가 위시리스트에 추가되었음을 나타내는 상태를 설정
        setWishlistDocId(docRef.id); // 추가된 문서의 ID를 상태로 설정
        const cachedWishlist =
          JSON.parse(localStorage.getItem(`wishlist-${user.uid}`)) || []; // 로컬 저장소에서 사용자별 위시리스트 데이터를 가져옴. 저장된 데이터가 없으면 빈 배열을 사용.

        // 새로 추가된 영화 정보를 위시리스트 데이터에 추가
        cachedWishlist.push({
          movieId: id,
          name: title,
          score,
          imageUrl: `${imgBasePath}${img}`,
          id: docRef.id,
        });

        // 업데이트된 위시리스트 데이터를 JSON 문자열로 변환하여 로컬 저장소에 저장
        localStorage.setItem(
          `wishlist-${user.uid}`,
          JSON.stringify(cachedWishlist)
        );
        window.dispatchEvent(new Event("wishlist-update")); // "wishlist-update"라는 커스텀 이벤트를 디스패치
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        setIsWish(false); // 호출하여 추가되지 않았음을 나타내는 상태를 설정
      }
    }
  };

  // 사용자가 위시리스트에서 특정 영화를 제거하는 기능을 구
  const removeFromWishlist = async () => {
    if (user && wishlistDocId) {
      try {
        // 해당 문서를 삭제. 문서 경로는 doc(db, "users", user.uid, "wishlist", wishlistDocId)로 지정
        await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
        setIsWish(false); // 영화가 위시리스트에 없음을 나타내는 상태를 설정
        setWishlistDocId(null); // 문서 ID를 null로 설정
        const cachedWishlist =
          JSON.parse(localStorage.getItem(`wishlist-${user.uid}`)) || []; // 로컬 저장소에서 사용자별 위시리스트 데이터를 가져옴. 저장된 데이터가 없으면 빈 배열을 사용.

        const updatedWishlist = cachedWishlist.filter(
          (item) => item.movieId !== id // 삭제된 영화의 movieId와 일치하지 않는 항목들만 남김
        );
        localStorage.setItem(
          `wishlist-${user.uid}`,
          JSON.stringify(updatedWishlist)
        ); // 업데이트된 위시리스트 데이터를 JSON 문자열로 변환하여 로컬 저장소에 저장
        window.dispatchEvent(new Event("wishlist-update")); // "wishlist-update"라는 커스텀 이벤트를 디스패치 // 위시리스트가 업데이트되었음을 애플리케이션의 다른 부분에 알림
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        setIsWish(true); // 삭제되지 않았음을 나타내는 상태를 설정
      }
    }
  };

  const handleOnWishlist = async () => {
    if (isWish) {
      setIsWish(false);
      await removeFromWishlist();
    } else {
      setIsWish(true);
      await addToWishlist();
    }
  };

  return (
    <div className="list-box">
      <div className="img">
        <img
          src={`${imgBasePath}${img}`}
          alt={title}
          onClick={() => navigate(`/${id}`)}
        />
      </div>
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>
        {user && (
          <p
            className={`wish ${isWish === true ? "liked" : "unliked"}`}
            onClick={handleOnWishlist}
          >
            {isWish === null ? "⌛" : isWish ? "🩷" : "🤍"}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
