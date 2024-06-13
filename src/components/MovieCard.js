import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "firebase/firestore"; // Firebase Firestore 관련 함수들 불러오기
import { db } from "../firebase"; // Firebase 설정 불러오기
import { useAuth } from "./AuthContext"; // 사용자 인증 정보 제공하는 컨텍스트 불러오기

// MovieCard 컴포넌트 정의, props로 id, title, score, img 받음
const MovieCard = ({ id, title, score, img }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅 사용
  const { user } = useAuth(); // 현재 사용자 정보 가져오기
  const [isWish, setIsWish] = useState(false); // 위시리스트에 있는지 여부 상태
  const [wishlistDocId, setWishlistDocId] = useState(null); // 위시리스트 문서 ID 상태

  // 위시리스트 상태를 가져오는 함수 정의 및 useCallback 훅으로 메모이제이션
  const fetchWishlistStatus = useCallback(async () => {
    if (user) {
      try {
        // 특정 사용자의 위시리스트에서 현재 영화 ID에 해당하는 문서 쿼리
        const q = query(
          collection(db, "users", user.uid, "wishlist"),
          where("movieId", "==", id)
        );
        const querySnapshot = await getDocs(q); // 쿼리 실행
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; // 첫 번째 문서의 ID 가져오기
          setIsWish(true); // 위시리스트에 있음을 표시
          setWishlistDocId(docId); // 문서 ID 상태 업데이트
        } else {
          setIsWish(false); // 위시리스트에 없음 표시
          setWishlistDocId(null); // 문서 ID 초기화
        }
      } catch (error) {}
    }
  }, [id, user]);

  // 컴포넌트가 마운트될 때와 fetchWishlistStatus 함수가 변경될 때 실행
  useEffect(() => {
    fetchWishlistStatus(); // 위시리스트 상태 가져오기
  }, [fetchWishlistStatus]);

  // 위시리스트에 추가하는 함수
  const addToWishlist = async () => {
    if (user) {
      try {
        // 위시리스트 컬렉션에 새 문서 추가
        const docRef = await addDoc(
          collection(db, "users", user.uid, "wishlist"),
          {
            movieId: id,
            name: title,
            score,
            imageUrl: `${imgBasePath}${img}`,
          }
        );
        setWishlistDocId(docRef.id); // 추가된 문서 ID 상태 업데이트
        window.dispatchEvent(new Event("wishlist-update")); // 위시리스트 업데이트 이벤트 트리거
        setIsWish(true); // 위시리스트에 있음을 표시
      } catch (error) {}
    }
  };

  // 위시리스트에서 제거하는 함수
  const removeFromWishlist = async () => {
    if (user && wishlistDocId) {
      try {
        // 위시리스트에서 특정 문서 삭제
        await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
        console.log("Movie removed from wishlist"); // 삭제 로그 출력
        setWishlistDocId(null); // 문서 ID 초기화
        window.dispatchEvent(new Event("wishlist-update")); // 위시리스트 업데이트 이벤트 트리거
        setIsWish(false); // 위시리스트에 없음 표시
      } catch (error) {
        console.error("Error removing from wishlist:", error); // 에러 로그 출력
      }
    }
  };

  // 위시리스트 추가/제거 핸들러 함수
  const handleOnWishlist = async () => {
    if (isWish) {
      await removeFromWishlist(); // 위시리스트에서 제거
    } else if (user && !isWish) {
      await addToWishlist(); // 위시리스트에 추가
      alert("위시리스트에 추가되었습니다."); // 알림 표시
    } else {
      alert("로그인이 필요합니다."); // 로그인 필요 알림
    }
  };

  return (
    <div className="list-box">
      {!img ? (
        <div className="img empty"></div>
      ) : (
        <Link to={`/${id}`} className="img">
          <img src={`${imgBasePath}${img}`} alt={title} />
        </Link>
      )}
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>

        <button
          className={`wish ${isWish ? "liked" : "unliked"}`}
          onClick={handleOnWishlist}
        >
          {isWish === null ? "⌛" : isWish ? "🩷" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard; // MovieCard 컴포넌트 내보내기
