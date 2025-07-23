import db from '../db.js';

export function getAllMovies(callback) {
  const query = "SELECT * FROM movie";
  db.query(query, callback);
}

