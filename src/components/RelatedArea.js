import React, { useState, useEffect } from "react";
import { imgBasePath } from "./constant";

const RelatedArea = ({ handleOnWishlist, belongs_to_collection }) => {
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    if (belongs_to_collection && belongs_to_collection.isWish) {
      setIsWish(belongs_to_collection.isWish);
    }
  }, [belongs_to_collection]);

  const handleToggleWishlist = () => {
    console.log(
      "Toggling wishlist for related item:",
      belongs_to_collection.id,
      "Current isWish:",
      isWish
    );
    handleOnWishlist(belongs_to_collection.id, isWish);
    setIsWish(!isWish);
  };

  if (!belongs_to_collection) {
    return <p className="related-area no-data">관련 영상이 비어 있습니다.</p>;
  }

  return (
    <div className="related-area">
      <div className="related-item">
        <img
          src={`${imgBasePath}${
            belongs_to_collection.poster_path ||
            belongs_to_collection.backdrop_path
          }`}
          alt={belongs_to_collection.name}
          className="related-poster"
        />
        <div className="related-info">
          <h3>{belongs_to_collection.name}</h3>
          <p>{belongs_to_collection.overview}</p>
          <button
            className={`wish ${isWish ? "active" : ""}`}
            onClick={handleToggleWishlist}
          >
            {isWish ? "위시리스트에서 제거" : "위시리스트에 추가"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedArea;
