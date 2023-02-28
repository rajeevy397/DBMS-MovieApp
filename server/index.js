// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3001;

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movie_db',
});

// Connect to MySQL database
connection.connect((error) => {
  if (error) {
    console.error(`Error connecting to database: ${error}`);
  } else {
    console.log(`Connected to database on thread ${connection.threadId}`);
  }
});

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle GET request for movies directed by 'james_cameron'
app.get('/movies/james_cameron', (req, res) => {
  const sql = `SELECT Mov_Title FROM MOVIES INNER JOIN DIRECTOR ON MOVIES.Dir_id = DIRECTOR.Dir_id WHERE Dir_Name = 'James Cameron'`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error retrieving movies');
    } else {
      res.json(results);
    }
  });
});
 
// Handle GET request for movies with multiple actors
app.get('/movies/multiple-actors', (req, res) => {
  const sql = `SELECT Mov_Title FROM MOVIES INNER JOIN MOVIE_CAST ON MOVIES.Mov_id = MOVIE_CAST.Mov_id GROUP BY MOVIES.Mov_id HAVING COUNT(*) > 1`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error retrieving movies');
    } else {
      res.json(results);
    }
  });
});

// Handle GET request for actors who acted in a movie before 2000 and after 2015
app.get('/actors/2000-2015', (req, res) => {
  const query = `
    SELECT DISTINCT Act_Name
    FROM ACTOR
    JOIN MOVIE_CAST ON ACTOR.Act_id = MOVIE_CAST.Act_id
    JOIN MOVIES ON MOVIE_CAST.Mov_id = MOVIES.Mov_id
    WHERE MOVIES.Mov_Year < 2000 OR MOVIES.Mov_Year > 2015;
  `;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

// Handle GET request for movie ratings
app.get('/movies/ratings', (req, res) => {
  const sql = `SELECT MOVIES.Mov_id, Mov_Title, MAX(Rev_Stars) AS Max_Stars FROM MOVIES INNER JOIN RATING ON MOVIES.Mov_id = RATING.Mov_id GROUP BY MOVIES.Mov_id ORDER BY Mov_Title`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error retrieving movie ratings');
    } else {
      res.json(results);
    }
  });
});

// Handle PUT request to update ratings for Quentin Tarantino movies
app.put('/movies/steven_spielberg', (req, res) => {
  const sql = `UPDATE RATING
               SET Rev_Stars = 4
               WHERE Mov_id IN (
                 SELECT Mov_id
                 FROM MOVIES
                 WHERE Dir_id = (
                   SELECT Dir_id
                   FROM DIRECTOR
                   WHERE Dir_Name = 'Steven Spielberg'
                 )
               )`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error updating ratings');
    } else {
      res.send(`Updated ${results.affectedRows} movies`);
    }
  });
});

// Impelmenting dynamic feature

// Handle GET request for movies directed by a specific director
app.get('/movies/director', (req, res) => {
  const directorName = req.query.name;
  const sql = `
    SELECT Mov_Title
    FROM MOVIES
    INNER JOIN DIRECTOR ON MOVIES.Dir_id = DIRECTOR.Dir_id
    WHERE Dir_Name LIKE '%${directorName}%'
  `;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error retrieving movies');
    } else {
      res.json(results);
    }
  });
});

app.get('/actors/two-movies', (req, res) => {
  const sql = `
    SELECT ACTOR.Act_Name, COUNT(*) AS Num_Movies
    FROM ACTOR
    JOIN MOVIE_CAST ON ACTOR.Act_id = MOVIE_CAST.Act_id
    GROUP BY ACTOR.Act_Name
    HAVING COUNT(*) >= 2
  `;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(`Error executing query: ${error}`);
      res.status(500).send('Error retrieving actors');
    } else {
      res.json(results);
    }
  });
});







// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
