import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { imgBasePath } from "./constant";
import "./MovieDetail.css";
import instance from "../api/axios";

const MovieDetail = () => {
  const { id } = useParams(); // useParams 훅을 사용하여 movieId 추출
  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get(`/movie/${id}`);
        setMovieDetail(response.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    fetchData(); // fetchData 함수 호출
  }, [id]); // id가 변경될 때마다 useEffect 실행

  if (!movieDetail) {
    return <div>영화를 찾을 수 없습니다.</div>;
  }
  return (
    <div className="detail-box">
      <div className="detail-img">
        <img
          src={`${imgBasePath}${movieDetail.poster_path}`}
          alt={movieDetail.title}
        />
      </div>
      <div className="info">
        <h1>{movieDetail.title}</h1>
        <p class="detail-score">⭐️ {movieDetail.vote_average}</p>
        <p className="detail-genres">
          {movieDetail.genres.map((data) => (
            <span>{data.name}</span>
          ))}
        </p>
        <p className="detail-overview">{movieDetail.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
