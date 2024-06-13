import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieVisual.css";

const MovieVisual = ({
  id,
  title,
  img,
  background,
  video,
  overview,
  parallaxAmount,
  parallaxOpacity,
}) => {
  const navigate = useNavigate();

  return (
    <div className="visual-box">
      <Link
        to={`/${id}`}
        className="img"
        data-swiper-parallax={parallaxAmount}
        data-swiper-parallax-opacity={parallaxOpacity}
      >
        <img src={`${imgBasePath}${background}`} alt={title} />
      </Link>
      <div className="info">
        <strong>{title}</strong>
        <p>{overview}</p>
        {!video ? (
          <Link to={`/${id}`} className="btn-detail">
            자세히보기
          </Link>
        ) : (
          <Link to={`/${id}`} className="btn-detail">
            예고편보기
          </Link>
        )}
      </div>
    </div>
  );
};

export default MovieVisual;
