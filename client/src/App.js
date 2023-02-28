// import React from 'react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'http://localhost:3001';

const App = () => {
  const [actors, setActors] = useState([]);
  const [moviesByJames, setMoviesByJames] = useState([]);
  const [error, setError] = useState(null);
  const [actorsByYear, setActorsByYear] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [message, setMessage] = useState('');

  const handleUpdateRatings = () => {
    axios
      .put('http://localhost:3001/movies/steven_spielberg')
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Fetch movie ratings
    axios
      .get(`${BASE_URL}/movies/ratings`)
      .then((response) => setRatings(response.data))
      .catch((error) => setError(error.response.data));
  }, []);

  useEffect(() => {
    // Fetch actors who acted in a movie before 2000 and also in a movie after 2015
    axios
      .get(`${BASE_URL}/actors/2000-2015`)
      .then((response) => setActorsByYear(response.data))
      .catch((error) => setError(error.response.data));
  }, []);

  useEffect(() => {
    // Fetch movies with multiple actors
    axios
      .get(`${BASE_URL}/movies/multiple-actors`)
      .then((response) => setActors(response.data))
      .catch((error) => setError(error.response.data));
  }, []);

  useEffect(() => {
    // Fetch movies directed by 'james_cameron'
    axios
      .get(`${BASE_URL}/movies/james_cameron`)
      .then((response) => setMoviesByJames(response.data))
      .catch((error) => setError(error.response.data));
  });

  return (
    <div className="App">
      <>
        {/* MovieByJamesCameron */}
        <div className="main">
          <div className="movie_by_james">
            <h1>Movies Directed by james_cameron</h1>
            {moviesByJames.length > 0 ? (
              <ul>
                {moviesByJames.map((movie) => (
                  <li key={movie.Mov_id}>{movie.Mov_Title}</li>
                ))}
              </ul>
            ) : (
              <p>Start the Server</p>
            )}
          </div>
        </div>

        {/* Movies with MultipleActors */}
        <div className="MovieListMain">
          <div className="MovieList">
            <h1>Movies with Multiple Actors</h1>
            {actors.length > 0 ? (
              <ul>
                {actors.map((actor) => (
                  <li key={actor.Mov_id}>{actor.Mov_Title}</li>
                ))}
              </ul>
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </div>

        {/* Actors2000And2015 */}
        <div className="Actors">
          <div className="actors2000And2015">
            <h1>Actors Who Acted in a Movie Before 2000 and After 2015</h1>
            {actorsByYear.length > 0 ? (
              <ul>
                {actorsByYear.map((actor) => (
                  <li key={actor.Act_id}>{actor.Act_Name}</li>
                ))}
              </ul>
            ) : (
              <p>No actors found.</p>
            )}
          </div>
        </div>

        {/* MovieRatings */}
        <div className="MovieRatingMain">
          <div className="movieRating">
            <h1>Movie Ratings</h1>
            {ratings.length > 0 ? (
              <ul>
                {ratings.map((rating) => (
                  <li key={rating.Mov_id}>
                    {rating.Mov_Title}: {rating.Max_Stars} stars
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings found.</p>
            )}
          </div>
        </div>

        {/* UpdateRating */}
        <div className="updateRatingMain">
          <div className="updateRating">
            <h1>Movie Database</h1>
            <button className="button" onClick={handleUpdateRatings}>
              Update Steven Spielberg Ratings
            </button>
            <p>{message}</p>
          </div>
        </div>
      </>
    </div>
  );
};
export default App;
