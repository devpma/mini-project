import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieDetail.css";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";
import ReviewArea from "./ReviewArea";
import DetailInfoArea from "./DetailInfoArea";
import RelatedArea from "./RelatedArea";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const MovieDetail = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [isWish, setIsWish] = useState(false);

  const { wishlist, fetchWishlist, addToWishlist, removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const apiKey = process.env.REACT_APP_MY_API;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ko-KR`
        );
        const data = await response.json();
        setMovieDetail(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    console.log("Wishlist state in MovieDetail:", wishlist); // 로그 추가
    const wishItem = wishlist.find((item) => item.movieId === parseInt(id));
    setIsWish(!!wishItem);
  }, [wishlist, id]);

  const handleToggleWishlist = useCallback(async () => {
    if (isWish) {
      await removeFromWishlist(parseInt(id));
    } else {
      await addToWishlist(
        parseInt(id),
        movieDetail.title,
        movieDetail.vote_average,
        movieDetail.backdrop_path
      );
    }
    await fetchWishlist();
  }, [
    isWish,
    id,
    movieDetail,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
  ]);

  const fetchReviews = useCallback(async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("movieId", "==", id),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOnReview = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }

    try {
      if (editingReviewId) {
        const docRef = doc(db, "reviews", editingReviewId);
        await updateDoc(docRef, {
          text: review,
          timestamp: new Date(),
        });
        setReview("");
        setEditingReviewId(null);
      } else {
        await addDoc(collection(db, "reviews"), {
          movieId: id,
          text: review,
          userId: user.uid,
          userName: user.email,
          userPhoto: user.photoURL || "/images/icon-user.png",
          timestamp: new Date(),
        });
        setReview("");
      }
      fetchReviews();
    } catch (error) {
      console.error("Error adding or updating review:", error);
    }
  };

  const handleEditReview = (review) => {
    if (review.userId !== user.uid) {
      alert("본인만 리뷰를 수정할 수 있습니다.");
      return;
    }
    setReview(review.text);
    setEditingReviewId(review.id);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      alert("로그인 후 리뷰를 삭제할 수 있습니다.");
      return;
    }

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다.");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  const menuArr = [
    {
      name: "리뷰",
      content: (
        <ReviewArea
          handleOnReview={handleOnReview}
          review={review}
          handleWriteReview={(e) => setReview(e.target.value)}
          reviews={reviews}
          handleDeleteReview={handleDeleteReview}
          user={user}
          handleEditReview={handleEditReview}
          editingReviewId={editingReviewId}
        />
      ),
    },
    {
      name: "상세정보",
      content: (
        <DetailInfoArea movieDetail={movieDetail} imgBasePath={imgBasePath} />
      ),
    },
    {
      name: "관련영상",
      content: movieDetail?.belongs_to_collection ? (
        <RelatedArea
          belongs_to_collection={movieDetail.belongs_to_collection}
          handleOnWishlist={handleToggleWishlist}
        />
      ) : (
        <p className="related-area no-data">관련 영상이 비어 있습니다.</p>
      ),
    },
  ];

  return (
    <>
      {movieDetail ? (
        <>
          <div className="detail-box">
            <div className="info">
              <h1>{movieDetail.title}</h1>
              <p className="detail-score">⭐️ {movieDetail.vote_average}</p>
              <p className="detail-genres">
                {movieDetail.genres && movieDetail.genres.length > 0 ? (
                  movieDetail.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))
                ) : (
                  <p>장르 정보가 없습니다.</p>
                )}
              </p>
              <p className="detail-overview">
                {movieDetail.overview && movieDetail.overview.length > 100
                  ? showMore
                    ? movieDetail.overview
                    : `${movieDetail.overview.substring(0, 100)}...`
                  : movieDetail.overview}
                {movieDetail.overview && movieDetail.overview.length > 100 && (
                  <span onClick={() => setShowMore(!showMore)} className="more">
                    {showMore ? " 접기" : " 더보기"}
                  </span>
                )}
              </p>
            </div>
            <div className="detail-img">
              <img
                src={`${imgBasePath}${movieDetail.backdrop_path}`}
                alt={movieDetail.title}
              />
              <ul className="movie-links">
                <li>
                  <button
                    className={`wish ${isWish ? "active" : ""}`}
                    onClick={handleToggleWishlist}
                  >
                    {isWish ? "위시리스트에서 제거" : "위시리스트에 추가"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="detail-btm">
            <ul className="detail-tabs">
              {menuArr.map((item, index) => (
                <li
                  key={index}
                  className={index === currentTab ? "active" : ""}
                  onClick={() => setCurrentTab(index)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <div className="tab-content">{menuArr[currentTab].content}</div>
          </div>
        </>
      ) : (
        <div className="no-data">
          <span className="loader"></span>
          <div>영화를 찾을 수 없습니다.</div>
        </div>
      )}
    </>
  );
};

export default MovieDetail;
