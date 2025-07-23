import db from "./db.js";

const migrationSQL = `
DROP TABLE IF EXISTS user_save_movie, user, production_company, persona, movie_production_companies, movie_genres, movie_actors, movie, genre, admin, actor;

CREATE TABLE IF NOT EXISTS actor (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_actor VARCHAR(255) NOT NULL,
  biography TEXT NOT NULL,
  date_of_birth DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS admin (
  id_admin INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_persona INT NOT NULL,
  KEY id_persona (id_persona)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS genre (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS movie (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  release_year DATE NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  background_url VARCHAR(255) NOT NULL,
  trailer_url VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS movie_actors (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_movie INT NOT NULL,
  id_actor INT NOT NULL,
  character_name VARCHAR(255) NOT NULL,
  KEY id_actor (id_actor),
  KEY id_movie (id_movie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS movie_genres (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_movie INT NOT NULL,
  id_genre INT NOT NULL,
  KEY id_genre (id_genre),
  KEY id_movie (id_movie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS movie_production_companies (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_movie INT NOT NULL,
  id_company INT NOT NULL,
  KEY id_company (id_company),
  KEY id_movie (id_movie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS persona (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  email VARCHAR(30) NOT NULL,
  password VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS production_company (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user (
  id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_persona INT NOT NULL,
  KEY id_persona (id_persona)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_save_movie (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  save_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_user INT NOT NULL,
  id_movie INT NOT NULL,
  KEY id_movie (id_movie),
  KEY id_user (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Foreign keys
ALTER TABLE admin ADD CONSTRAINT admin_ibfk_1 FOREIGN KEY (id_persona) REFERENCES persona (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_actors ADD CONSTRAINT movie_actors_ibfk_1 FOREIGN KEY (id_actor) REFERENCES actor (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_actors ADD CONSTRAINT movie_actors_ibfk_2 FOREIGN KEY (id_movie) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_genres ADD CONSTRAINT movie_genres_ibfk_1 FOREIGN KEY (id_genre) REFERENCES genre (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_genres ADD CONSTRAINT movie_genres_ibfk_2 FOREIGN KEY (id_movie) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_production_companies ADD CONSTRAINT movie_production_companies_ibfk_1 FOREIGN KEY (id_company) REFERENCES production_company (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE movie_production_companies ADD CONSTRAINT movie_production_companies_ibfk_2 FOREIGN KEY (id_movie) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE user ADD CONSTRAINT user_ibfk_1 FOREIGN KEY (id_persona) REFERENCES persona (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE user_save_movie ADD CONSTRAINT user_save_movie_ibfk_1 FOREIGN KEY (id_movie) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE user_save_movie ADD CONSTRAINT user_save_movie_ibfk_2 FOREIGN KEY (id_user) REFERENCES user (id_user) ON DELETE CASCADE ON UPDATE CASCADE;
`;

db.query(migrationSQL, (err) => {
  if (err) throw err;
  console.log('Tablas creadas');
  db.end();
});