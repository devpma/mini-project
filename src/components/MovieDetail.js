import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieDetail.css";
import { db } from "../firebase"; // firebase.js에서 Firestore를 가져옵니다
import instance from "../api/axios";
import { useAuth } from "./AuthContext"; // useAuth 훅을 사용하여 user를 가져옵니다
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

const MovieDetail = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [currentTab, clickTab] = useState(0);
  const location = useLocation();
  const [isWish, setIsWish] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get(`/movie/${id}`);
        setMovieDetail(response.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewsQuery = query(
          collection(db, "reviews"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsData = querySnapshot.docs.map((doc) => doc.data());
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();
  }, []);

  const handleWriteReview = (e) => {
    setReview(e.target.value);
  };

  const handleOnReview = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await addDoc(collection(db, "reviews"), {
          movieId: id,
          text: review,
          userId: user.uid,
          userName: user.displayName || "홍길동",
          userPhoto: user.photoURL || "/images/icon-user.png",
          timestamp: new Date(),
        });
        setReview("");
        const reviewsQuery = query(
          collection(db, "reviews"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsData = querySnapshot.docs.map((doc) => doc.data());
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error adding review:", error);
      }
    } else {
      alert("로그인 후 리뷰를 작성할 수 있습니다.");
    }
  };

  const fetchWishlistStatus = useCallback(async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "users", user.uid, "wishlist"),
          where("movieId", "==", id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          setIsWish(true);
          setWishlistDocId(docId);
        } else {
          setIsWish(false);
          setWishlistDocId(null);
        }
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    }
  }, [id, user]);

  useEffect(() => {
    fetchWishlistStatus();
  }, [fetchWishlistStatus]);

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
        setWishlistDocId(docRef.id);
        window.dispatchEvent(new Event("wishlist-update"));
        setIsWish(true);
        alert("위시리스트에 추가되었습니다.");
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
        setWishlistDocId(null);
        window.dispatchEvent(new Event("wishlist-update"));
        setIsWish(false);
        alert("위시리스트에서 제거되었습니다.");
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
          handleWriteReview={handleWriteReview}
          reviews={reviews}
        />
      ),
    },
    {
      name: "상세정보",
      content: <DetailInfoArea movieDetail={movieDetail} />,
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
                  {showMore ? " 덜보기" : " 더보기"}
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

const ReviewArea = ({ handleOnReview, review, handleWriteReview, reviews }) => {
  return (
    <div className="review-wrap">
      <form className="review-write" onSubmit={handleOnReview}>
        <input
          type="text"
          className="write-input"
          value={review}
          placeholder="리뷰를 입력해 보세요."
          onChange={handleWriteReview}
        />
        <button type="submit" className="write-btn">
          리뷰작성
        </button>
      </form>
      <div className="review-box">
        <ul className="review">
          {reviews.map((review, index) => (
            <li className="box" key={index}>
              <div className="img">
                <img src={review.userPhoto} alt="profile img" />
              </div>
              <div className="info-box">
                <p className="text">
                  <span className="name">{review.userName}</span>
                  {review.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DetailInfoArea = ({ movieDetail }) => {
  return (
    <div className="detail-info-wrap">
      <div className="overview">{movieDetail.overview}</div>
      <div className="detail-info-box">
        <img
          src={`${imgBasePath}${movieDetail.poster_path}`}
          alt={movieDetail.title}
        />
        <dl className="detail-info">
          <dt>제목</dt>
          <dd>
            {movieDetail.title} ({movieDetail.original_title})
          </dd>
          <dt>장르</dt>
          <dd>
            {movieDetail.genres.map((data) => (
              <span key={data.id}>{data.name}</span>
            ))}
          </dd>
          <dt>평점</dt>
          <dd>
            {movieDetail.vote_average} ({movieDetail.vote_count})
          </dd>
          <dt>언어</dt>
          <dd>{movieDetail.original_language}</dd>
          <dt>발매일</dt>
          <dd>{movieDetail.release_date}</dd>
        </dl>
      </div>
    </div>
  );
};
