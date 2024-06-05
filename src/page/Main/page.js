import { useCallback, useEffect, useState } from "react";
import instance from "../../api/axios";
import MovieCard from "../../components/MovieCard";
import requests from "../../api/request";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MovieVisual from "../../components/MovieVisual";

function MainPage() {
  const [movies, setMovies] = useState();
  const [visualMovies, setVisualMovies] = useState();

  const fetchMovieData = useCallback(async () => {
    try {
      const response = await instance.get(requests.fetchMovieList);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error", error);
    }
  }, []);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const fetchVisualData = useCallback(async () => {
    try {
      const response = await instance.get(requests.fetchVisualList);
      setVisualMovies(response.data.results);
    } catch (error) {
      console.error("Error", error);
    }
  }, []);

  useEffect(() => {
    fetchVisualData();
  }, [fetchVisualData]);

  if (!movies) {
    return <span className="loader"></span>;
  }
  return (
    <>
      <Swiper
        pagination={{
          type: "progressbar",
          clickable: true,
        }}
        slidesPerView={3}
        spaceBetween={30}
        modules={[Pagination]}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="visual-wrap"
      >
        {visualMovies?.map((visual) => (
          <SwiperSlide>
            <MovieVisual
              key={visual.id}
              id={visual.id}
              title={visual.title}
              img={visual.poster_path}
              score={visual.vote_average}
              fetchUrl={requests.fetchVisualList}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="list-wrap">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            img={movie.poster_path}
            score={movie.vote_average}
            fetchUrl={requests.fetchMovieList}
          />
        ))}
      </div>
    </>
  );
}

export default MainPage;
