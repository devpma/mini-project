import React from "react";

const ReviewArea = ({
  handleOnReview,
  review,
  handleWriteReview,
  reviews,
  handleDeleteReview,
  handleEditReview,
  user,
  editingReviewId,
}) => {
  return (
    <div className="review-wrap">
      <form className="review-write" onSubmit={handleOnReview}>
        <input
          type="text"
          className="write-input"
          value={review}
          name="review"
          placeholder="리뷰를 입력해 보세요."
          onChange={handleWriteReview}
        />
        <button type="submit" className="write-btn">
          {editingReviewId ? "리뷰수정" : "리뷰작성"}
        </button>
      </form>
      {reviews.length === 0 ? (
        <div className="review-box no-data">리뷰가 없습니다. </div>
      ) : (
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
                    <p className="review-text">{review.text}</p>
                    {user ? (
                      <div class="review-btns">
                        <button onClick={() => handleEditReview(review)}>
                          수정
                        </button>
                        {review.userId === user?.uid && (
                          <button onClick={() => handleDeleteReview(review.id)}>
                            삭제
                          </button>
                        )}
                      </div>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewArea;
