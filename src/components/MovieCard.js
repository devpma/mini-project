import React from "react";
import { useNavigate } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieCard.css";

const MovieCard = ({ id, title, score, img }) => {
  const navigate = useNavigate();

  return (
    <div className="list-box">
      <div className="img">
        <img
          src={`${imgBasePath}${img}`}
          alt={title}
          onClick={() => navigate(`/${id}`)}
        />
      </div>
      <div className="info">
        <p className="title">{title}</p>
        <p className="score">⭐️ {score}</p>
      </div>
    </div>
  );
};

export default MovieCard;
