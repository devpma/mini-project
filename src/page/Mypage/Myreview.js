import React, { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Firebase 초기화 파일 경로 수정

const Myreview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched reviews: ", reviewsData); // 디버깅을 위한 로그
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return (
      <div className="loading">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="Myreview-wrap">
      <h1>MY REVIEW</h1>
      {reviews.length === 0 ? (
        <p className="no-data">리뷰가 없습니다.</p>
      ) : (
        <ul className="Myreview-box">
          {reviews.map((review) => (
            <li key={review.id}>
              <h3 className="title">{review.movieTitle}</h3>
              <p className="cont">{review.text}</p>
              <p className="date">
                {new Date(review.timestamp.seconds * 1000).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Myreview;
