import React from "react";
import { useParams } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieDetail.css";

const MovieDetail = ({ movieList }) => {
  const { id } = useParams();
  const numberId = Number(id);
  const item = movieList.find((data) => data.id === numberId);
  console.log(item);

  if (!item) {
    return <div>영화를 찾을 수 없습니다.</div>;
  }
  return (
    <div className="detail-box">
      <img src={`${imgBasePath}${item.poster_path}`} alt={item.title} />
      <div className="info">
        <h1>{item.title}</h1>
        <p>⭐️ {item.vote_average}</p>
        <p>{item.genres.map((data) => data.name).join(" / ")}</p>
        <p>{item.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
