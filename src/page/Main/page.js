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
import { useWishlist } from "../../components/WishlistContext";

function MainPage() {
  const [movies, setMovies] = useState();
  const [visualMovies, setVisualMovies] = useState();
  const [parallaxSwiper, setParallaxSwiper] = useState(null);
  const { fetchWishlist } = useWishlist();

  const parallaxAmount = parallaxSwiper ? parallaxSwiper.width * 0.95 : 0;
  const parallaxOpacity = 0.5;

  const fetchMovieData = useCallback(async () => {
    try {
      const response = await instance.get(requests.fetchMovieList);
      setMovies(response.data.results);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const fetchVisualData = useCallback(async () => {
    try {
      const response = await instance.get(requests.fetchVisualList);
      setVisualMovies(response.data.results);
      console.log(response.data.results);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchVisualData();
  }, [fetchVisualData]);

  useEffect(() => {
    fetchWishlist(); // 컴포넌트가 마운트될 때 위시리스트 상태를 가져옴
  }, [fetchWishlist]);

  if (!movies) {
    return <span className="loader"></span>;
  }
  const mainSliderConfigs = {
    containerclass: "swiper-container hero-slider",
    parallax: true,
    centeredSlides: true,
    speed: 500,
    spaceBetween: 0,
    effect: "slide",
  };

  return (
    <>
      <Swiper
        {...mainSliderConfigs}
        onSwiper={setParallaxSwiper}
        pagination={{
          type: "progressbar",
          clickable: true,
        }}
        modules={[Pagination]}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
        }}
        className="visual-wrap"
      >
        {visualMovies?.map((visual, index) => (
          <SwiperSlide key={index}>
            <MovieVisual
              id={visual.id}
              title={visual.title}
              overview={visual.overview}
              img={visual.poster_path}
              score={visual.vote_average}
              video={visual.video}
              fetchUrl={requests.fetchVisualList}
              background={visual.backdrop_path}
              parallaxAmount={parallaxAmount}
              parallaxOpacity={parallaxOpacity}
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
