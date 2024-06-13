import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
          <p className="detail-overview">{movieDetail.overview}</p>
        </div>
        <div className="detail-img">
          <img
            src={`${imgBasePath}${movieDetail.backdrop_path}`}
            alt={movieDetail.title}
          />
          <ul className="movie-links">
            <li className="premovie">
              <Link to="">예고편</Link>
            </li>
            <li className="wish">
              <Link to="">위시리스트</Link>
            </li>
            <li className="share">
              <Link to="">공유</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="detail-btm"></div>
    </>
  );
};

export default MovieDetail;
