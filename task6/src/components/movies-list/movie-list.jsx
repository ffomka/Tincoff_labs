import React, {useEffect, useState} from "react";
import MovieCard from "../movie-card/movie-card";
import "./movie-list.css";
import useDebounce from "./useDebounce";

function fetchFilms(value) {
  return fetch(`http://localhost:3300/movies?title_like=${value}`)
    .then((res) => res.json())
    .catch(() => alert("Error in fetch!"));
}

const MovieList = ({
  showMovie,
  callAddMovie,
  movies,
  setMovies,
  stateMovie
  }) => {

    const [value,setValue] = useState('');  
    const {debounceValue} = useDebounce(value,500)
  useEffect(()=>{
    fetchFilms(value).then((res)=>setMovies(res));
  },[debounceValue]);

  return (
    <div className="movies-list">
    <button
          className="btn-add"
          disabled={stateMovie==='EDIT' ? true : false}
          onClick={callAddMovie}
        >
          <p className="btn-add-text">add new movie</p>
        </button>
      <div className="search">
        <input
          className="input-search"
          id="input-search"
          placeholder="search"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="movies">
        {movies.length ?
          movies.map((elem) => (
            <MovieCard key={elem.id} movie={elem} showMovie={showMovie} />
          ))
        :
          null
        }
      </div>

    </div>
  );
};

export default MovieList;
