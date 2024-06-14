import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieDetail.css";
import { db } from "../firebase";
import instance from "../api/axios";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import ReviewArea from "./ReviewArea";
import DetailInfoArea from "./DetailInfoArea";
import WishlistArea from "./WishlistArea";

const MovieDetail = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const { user } = useAuth();
  const { wishlist, fetchWishlist } = useWishlist();
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [currentTab, clickTab] = useState(0);
  const [isWish, setIsWish] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get(`/movie/${id}`);
        setMovieDetail(response.data);
        console.log("Fetched movie data:", response.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = () => {
      if (user && wishlist) {
        const wishItem = wishlist.find((item) => item.movieId === id);
        if (wishItem) {
          setIsWish(true);
          setWishlistDocId(wishItem.id);
        } else {
          setIsWish(false);
          setWishlistDocId(null);
        }
        console.log("Checked wishlist status:", { isWish, wishlistDocId });
      }
    };
    checkWishlistStatus();
  }, [user, wishlist, id]);

  const handleOnReview = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }

    if (editingReviewId) {
      try {
        const docRef = doc(db, "reviews", editingReviewId);
        await updateDoc(docRef, {
          text: review,
          timestamp: new Date(),
        });
        setReview("");
        setEditingReviewId(null);
        console.log("Updated review:", docRef.id);
      } catch (error) {
        console.error("Error updating review:", error);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "reviews"), {
          movieId: id,
          text: review,
          userId: user.uid,
          userName: user.email,
          userPhoto: user.photoURL || "/images/icon-user.png",
          timestamp: new Date(),
        });
        setReview("");
        console.log("Added new review:", docRef.id);
      } catch (error) {
        console.error("Error adding review:", error);
      }
    }

    try {
      console.log("Re-fetching reviews after adding/updating review");
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
      console.log("Fetched reviews after adding/updating:", reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleEditReview = (review) => {
    if (review.userId !== user.uid) {
      alert("본인만 리뷰를 수정할 수 있습니다.");
      return;
    }
    setReview(review.text);
    setEditingReviewId(review.id);
    console.log("Editing review:", review.id);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      alert("로그인 후 리뷰를 삭제할 수 있습니다.");
      return;
    }

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter((review) => review.id !== reviewId));
      console.log("Deleted review:", reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const addToWishlist = async () => {
    if (user) {
      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "wishlist"),
          {
            movieId: id,
            name: movieDetail.title,
            score: movieDetail.vote_average,
            imageUrl: `${imgBasePath}${movieDetail.backdrop_path}`,
          }
        );
        await fetchWishlist();
        setWishlistDocId(docRef.id);
        setIsWish(true);
        alert("위시리스트에 추가되었습니다.");
        console.log("Added to wishlist:", docRef.id);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const removeFromWishlist = async () => {
    if (user && wishlistDocId) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
        await fetchWishlist();
        setWishlistDocId(null);
        setIsWish(false);
        alert("위시리스트에서 제거되었습니다.");
        console.log("Removed from wishlist:", wishlistDocId);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  const handleOnWishlist = async () => {
    if (isWish) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
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
      name: "테스트",
      content: <WishlistArea wishlist={wishlist} />,
    },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
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

  if (!movieDetail) {
    return (
      <div className="no-data">
        <span className="loader"></span>
        <div>영화를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <div className="detail-box">
        <div className="info">
          <h1>{movieDetail.title}</h1>
          <p className="detail-score">⭐️ {movieDetail.vote_average}</p>
          <p className="detail-genres">
            {movieDetail.genres.map((data) => (
              <span key={data.id}>{data.name}</span>
            ))}
          </p>
          <p className="detail-overview">
            {movieDetail.overview.length > 100 ? (
              <>
                {showMore
                  ? movieDetail.overview
                  : `${movieDetail.overview.substring(0, 100)}...`}
                <span onClick={() => setShowMore(!showMore)} className="more">
                  {showMore ? " 접기" : " 더보기"}
                </span>
              </>
            ) : (
              movieDetail.overview
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
              <Link to="" className="premovie">
                예고편
              </Link>
            </li>
            <li>
              <button
                className={`wish ${isWish ? "active" : ""}`}
                onClick={handleOnWishlist}
              >
                위시리스트
              </button>
            </li>
            <li>
              <button className="share" onClick={copyLinkToClipboard}>
                공유
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="detail-btm">
        <ul className="detail-tabs">
          {menuArr.map((el, index) => (
            <li
              key={index}
              className={index === currentTab ? "active" : ""}
              onClick={() => selectMenuHandler(index)}
            >
              {el.name}
            </li>
          ))}
        </ul>
        <div>{menuArr[currentTab].content}</div>
      </div>
    </>
  );
};

export default MovieDetail;
