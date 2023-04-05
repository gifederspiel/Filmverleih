import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'sml12345',
  database: 'movie-db',
});

await connection.connect();

export async function getAll(userid) {
  //Query erstellt in Kooperation mit Rouven
  const query = `SELECT 
                  Movies.id,
                  Movies.title,
                  AVG(CASE WHEN Ratings.user = ? THEN Ratings.rating ELSE NULL END) AS userRating,
                  AVG(Ratings.rating) AS averageRating
                FROM Movies
                LEFT JOIN Ratings ON Movies.id = Ratings.movie
                WHERE Movies.public = 1 OR Movies.user = ?
                GROUP BY Movies.id, Movies.title`; 
  const [data] = await connection.query(query, [userid, userid]);
  return data;
}

async function insert(movie) {
  const query = 'INSERT INTO Movies (title, year) VALUES (?, ?)';
  const [result] = await connection.query(query, [movie.title, movie.year]);
  return { ...movie, id: result.insertId };
}

async function update(movie, userid) {
  const query = 'UPDATE Movies SET title = ?, year = ?, public = ?, user = ? WHERE id = ?';
  await connection.query(query, [movie.title, movie.year, movie.public, userid, movie.id]);
  return movie;
}

export async function get(id) {
  const query = 'SELECT * FROM Movies WHERE id = ?';
  const [data] = await connection.query(query, [id]);
  return data.pop();
}

export async function remove(id) {
  const query = 'DELETE FROM Movies WHERE id = ?';
  await connection.query(query, [id]);
  return;
}

export function save(movie, userid) {
  if (movie.id) {
    return update(movie, userid);
  }
  return insert(movie);
}

export async function rate(userid, movieid, stars){
  const rating = await connection.query('SELECT * FROM Ratings WHERE user = ? AND movie = ?;', [userid, movieid]);
  if (rating[0][0]){
    await connection.query('UPDATE Ratings SET rating = ? WHERE user = ? AND movie = ?;', [stars, userid, movieid]);
  }
  else{
    await connection.query('INSERT INTO Ratings (user, movie, rating) VALUES (?, ?, ?);', [userid, movieid, stars]);
  }
  return;
}
