import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./style.css";
import { useNavigate } from "react-router-dom";

// Wishlist 컴포넌트 정의
const Wishlist = () => {
  // wishlistItems와 loading 상태 변수 정의
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [isWish, setIsWish] = useState(false); // 위시리스트에 있는지 여부 상태

  // fetchWishlist 함수 정의 및 useCallback 훅으로 메모이제이션
  const fetchWishlist = useCallback(async () => {
    const user = auth.currentUser; // 현재 인증된 사용자 가져오기
    if (user) {
      try {
        // Firestore에서 사용자의 wishlist 컬렉션 참조
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        // wishlist 컬렉션의 모든 문서 가져오기
        const wishlistSnapshot = await getDocs(wishlistRef);
        // 문서 데이터를 배열로 변환하여 상태에 저장
        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          movieId: doc.data().movieId, // movieId 필드를 포함
          ...doc.data(),
        }));
        setWishlistItems(wishlistData); // 상태 업데이트
      } catch (error) {
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    } else {
      console.log("User not authenticated"); // 사용자 인증 실패 메시지
      setLoading(false); // 로딩 상태 해제
    }
  }, []);

  // 컴포넌트가 마운트될 때와 fetchWishlist 함수가 변경될 때 실행
  useEffect(() => {
    const user = auth.currentUser; // 현재 인증된 사용자 가져오기
    if (user) {
      fetchWishlist(); // wishlist 데이터 가져오기
    } else {
      setLoading(false); // 사용자 인증 실패 시 로딩 상태 해제
    }

    // wishlist 업데이트 이벤트 리스너 정의
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };
    // wishlist 업데이트 이벤트 리스너 등록
    window.addEventListener("wishlist-update", handleWishlistUpdate);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("wishlist-update", handleWishlistUpdate);
    };
  }, [fetchWishlist]);

  // wishlist에서 항목 제거 함수 정의
  const removeFromWishlist = async (itemId) => {
    const user = auth.currentUser; // 현재 인증된 사용자 가져오기
    if (user) {
      try {
        // Firestore에서 해당 아이템 문서 참조
        const itemDoc = doc(db, "users", user.uid, "wishlist", itemId);
        // 해당 아이템 문서 삭제
        await deleteDoc(itemDoc);
        // 상태에서 아이템 제거
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        // wishlist 업데이트 이벤트 트리거
        window.dispatchEvent(new Event("wishlist-update"));
      } catch (error) {}
    } else {
    }
  };

  // 컴포넌트 렌더링
  return (
    <div className="wishlist-wrap">
      <h1>MYPAGE</h1>
      {loading ? (
        // 로딩 중일 때 로딩 스피너 표시
        <div className="loading">
          <span className="loader"></span>
        </div>
      ) : (
        // 로딩이 끝난 후 위시리스트 항목 표시
        <div>
          <ul className="list-wrap">
            {wishlistItems.length === 0 ? (
              // 위시리스트가 비어 있을 때 메시지 표시
              <div className="no-data">
                <div>위시리스트에 담긴 영화가 없습니다.</div>
              </div>
            ) : (
              // 위시리스트 항목들을 리스트로 표시
              wishlistItems.map((item) => (
                <li key={item.id} className="list-box">
                  <div
                    className="img"
                    onClick={() => navigate(`/${item.movieId}`)} // 영화 상세 페이지로 이동
                  >
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="info">
                    <p className="title">{item.name}</p>
                    <p className="score">⭐️ {item.score}</p>
                    <button
                      className="wish active"
                      onClick={() => removeFromWishlist(item.id)} // 위시리스트에서 제거
                    >
                      좋아요
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
