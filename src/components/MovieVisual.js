import React from "react";
import { useNavigate } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieVisual.css";

const MovieVisual = ({ id, title, img }) => {
  const navigate = useNavigate();

  return (
    <div className="visyal-box">
      <div className="img">
        <img
          src={`${imgBasePath}${img}`}
          alt={title}
          onClick={() => navigate(`/${id}`)}
        />
      </div>
    </div>
  );
};

export default MovieVisual;
