import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); //초기에는 오류가 없기 때문에 null일 것이다.
  //겉보기에는 단계적으로 실행되는 동기화 작업으로 보이지만 백그라운드에서는 아까 봤었던 then 호출로 코드가 변환되고 있다.
  //여기에 async,await를 추가한 이유는 코드를 읽기 더 쉬워지기 때문이다.
  async function fetchmoviesHandler() {
    setIsLoading(true); //요청을 보내는 함수를 실행하자마자 isLoading을 true로 변환
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      //오류 메세지를 보여줘서 사용자에게 알려주자
      if (!response.ok) {
        throw new Error("something went wrong!"); //얘가 발동되면 그 다음 코드는 실행되지 않음. 그래서 catch블럭이 있는 것이다.
      }

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
    } catch (error) {
      //여기서 직면한 문제는 fetch API는 이러한 에러 상태 코드를 실제 에러로 판단하지 않는다. 그렇기 때문에 실제 에러로
      //발생하게 하는 것이 좋은 처리 방식일 것이다
      setError(error.message);
    }
    setIsLoading(false); //위에 서버 api를 통해서 요청을 보내는 과정이 모두 끝나면 다시 false로 바꾼다.
    //fetch함수를 통해 해당 api에게 요청해서 response를 받아오는 것.
    //만일 오류 캐치할때, then()을 쓴다면 .catch()로 오류를 잡아내고 async await이면 try-catch를 이용해 잡아낸다.
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {isLoading && <p> isLoading... </p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
