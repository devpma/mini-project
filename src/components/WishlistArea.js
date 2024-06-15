import React from "react";
import { imgBasePath } from "./constant";

const WishlistArea = ({ wishlist, handleOnWishlist }) => {
  return (
    <div className="wishlist-area">
      {wishlist.length > 0 ? (
        <ul className="wishlist-items">
          {wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              <img
                src={`${imgBasePath}${item.imageUrl}`}
                alt={item.name}
                className="wishlist-poster"
              />
              <div className="wishlist-info">
                <h3>{item.name}</h3>
                <p>⭐️ {item.score}</p>
                <button
                  className={`wish ${item.isWish ? "active" : ""}`}
                  onClick={() => handleOnWishlist(item.movieId, item.isWish)}
                >
                  {item.isWish ? "위시리스트에서 제거" : "위시리스트에 추가"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>위시리스트가 비어 있습니다.</p>
      )}
    </div>
  );
};

export default WishlistArea;
