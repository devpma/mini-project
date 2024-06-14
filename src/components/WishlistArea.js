import React from "react";

const WishlistArea = ({ wishlist }) => {
  return (
    <div className="wishlist-wrap">
      <ul className="wishlist">
        {wishlist.map((item) => (
          <li key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>Score: {item.score}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishlistArea;
