import React from "react";

const DetailInfoArea = ({ movieDetail, imgBasePath }) => {
  return (
    <div className="detail-info-wrap">
      <div className="overview">{movieDetail.overview}</div>
      <div className="detail-info-box">
        {!movieDetail.poster_path ? (
          <div className="img empty"></div>
        ) : (
          <div className="img">
            <img
              src={`${imgBasePath}${movieDetail.poster_path}`}
              alt={movieDetail.title}
            />
          </div>
        )}
        <dl className="detail-info">
          <dt>제목</dt>
          <dd>
            {movieDetail.title}{" "}
            {movieDetail.original_title ? movieDetail.original_title : null}
          </dd>
          <dt>장르</dt>
          <dd>
            {movieDetail.genres &&
              movieDetail.genres.map((data) => (
                <span key={data.id}>{data.name}</span>
              ))}
          </dd>
          <dt>평점</dt>
          <dd>
            {movieDetail.vote_average}{" "}
            {movieDetail.vote_count ? movieDetail.vote_count : null}
          </dd>
          <dt>언어</dt>
          <dd>{movieDetail.original_language}</dd>
          <dt>개봉일</dt>
          <dd>{movieDetail.release_date}</dd>
        </dl>
      </div>
    </div>
  );
};

export default DetailInfoArea;
