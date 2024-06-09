import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./style.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore에서 사용자의 위시리스트 데이터를 가져와서 상태를 업데이트하고, 로컬 스토리지에 캐시하는 함수
  const fetchWishlist = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist"); // Firestore에서 사용자의 위시리스트 컬렉션에 대한 참조를 생성
        const wishlistSnapshot = await getDocs(wishlistRef); // 해당 컬렉션의 문서를 가져옴
        const wishlistData = wishlistSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // 각 문서를 id와 함께 객체로 변환
        setWishlistItems(wishlistData); // 위시리스트 데이터를 상태로 설정
        localStorage.setItem(
          `wishlist-${user.uid}`, // 키를 이용하여 사용자별로 저장
          JSON.stringify(wishlistData)
        ); // 가져온 데이터를 JSON 문자열로 변환하여 로컬 스토리지에 저장
      } catch (error) {
        console.error("Error fetching wishlist: ", error);
      } finally {
        setLoading(false); // 로딩 상태를 false로 설정하여 로딩이 완료되었음을 표시
      }
    } else {
      setLoading(false); // 인증된 사용자가 없는 경우에도 로딩 상태를 false로 설정
    }
  }, []);

  // 컴포넌트가 마운트될 때와 fetchWishlist 함수가 변경될 때 실행
  useEffect(() => {
    const user = auth.currentUser; // 현재 인증된 사용자를 가져옴
    if (user) {
      // 로컬 저장소에서 위시리스트 데이터 불러오기
      const cachedWishlist = localStorage.getItem(`wishlist-${user.uid}`);
      if (cachedWishlist) {
        setWishlistItems(JSON.parse(cachedWishlist)); // 캐시된 데이터가 있으면 이를 파싱하여 상태로 설정
      }
      fetchWishlist(); // Firestore에서 최신 데이터 불러오기
    } else {
      setLoading(false); // 인증된 사용자가 없는 경우 로딩 상태를 false로 설정
    }

    const handleWishlistUpdate = () => {
      fetchWishlist(); // Firestore에서 데이터를 가져와 상태와 로컬 저장소를 업데이트
    }; // Firestore에서 데이터를 가져와 상태와 로컬 저장소를 업데이트
    window.addEventListener("wishlist-update", handleWishlistUpdate); // 함수를 정의하여 위시리스트 업데이트 이벤트가 발생할 때 fetchWishlist를 호출

    return () => {
      window.removeEventListener("wishlist-update", handleWishlistUpdate); // "wishlist-update" 이벤트 리스너를 제거하여 메모리 누수를 방지
    };
  }, [fetchWishlist]);

  // Firestore에서 위시리스트 항목을 삭제하고, React 상태와 로컬 스토리지를 업데이트
  const removeFromWishlist = async (itemId) => {
    const user = auth.currentUser; // 현재 인증된 사용자를 가져옵
    if (user) {
      try {
        const itemDoc = doc(db, "users", user.uid, "wishlist", itemId); // Firestore에서 삭제할 문서에 대한 참조를 생성 // itemId는 삭제할 항목의 ID
        await deleteDoc(itemDoc); // 해당 문서를 Firestore에서 삭제

        setWishlistItems((prevItems) => {
          const updatedWishlistItems = prevItems.filter(
            (item) => item.id !== itemId
          ); // 삭제할 항목의 ID와 일치하지 않는 항목들만 남김
          localStorage.setItem(
            `wishlist-${user.uid}`,
            JSON.stringify(updatedWishlistItems)
          ); // 업데이트된 위시리스트 데이터를 로컬 스토리지에 저장
          return updatedWishlistItems;
        });

        window.dispatchEvent(new Event("wishlist-update")); //  "wishlist-update"라는 커스텀 이벤트를 디스패치 // 위시리스트가 업데이트되었음을 애플리케이션의 다른 부분에 알림
      } catch (error) {}
    } else {
    }
  };

  return (
    <div className="wishlist-wrap">
      <h1>WISH LIST</h1>
      {loading ? (
        <div className="no-data">
          <span className="loader"></span>
        </div>
      ) : (
        <div>
          <ul className="list-wrap">
            {wishlistItems.length === 0 && !loading ? (
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
                      className="wish"
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
