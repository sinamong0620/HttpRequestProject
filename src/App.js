import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //겉보기에는 단계적으로 실행되는 동기화 작업으로 보이지만 백그라운드에서는 아까 봤었던 then 호출로 코드가 변환되고 있다.
  //여기에 async,await를 추가한 이유는 코드를 읽기 더 쉬워지기 때문이다.
  async function fetchmoviesHandler() {
    setIsLoading(true); //요청을 보내는 함수를 실행하자마자 isLoading을 true로 변환
    //fetch함수를 통해 해당 api에게 요청해서 response를 받아오는 것.
    const response = await fetch("https://swapi.dev/api/films/");
    const data = await response.json();

    //해당 api에서 보내주는 객체가 이름이 달라서 우리 이름으로 바꿔준다음에 transform한 정보를 객체에다가 담아준다.
    //그리고 그것을 movies에 저장한다!
    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
    setIsLoading(false); //위에 서버 api를 통해서 요청을 보내는 과정이 모두 끝나면 다시 false로 바꾼다.
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {isLoading && <p> isLoading </p>}
      </section>
    </React.Fragment>
  );
}

export default App;
