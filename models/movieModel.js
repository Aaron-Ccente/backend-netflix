const db = require('../db');

function getAllMovies(callback) {
  const query = "SELECT * FROM movie";
  db.query(query, callback);
}

module.exports = {
  getAllMovies,
};

