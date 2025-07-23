import fs from 'fs';
import path from 'path';
import db from './db.js';

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/Database/bd.json'), 'utf8'));

// Insert production companies
if (data.production_company && data.production_company.length) {
  data.production_company.forEach((company, idx) => {
    db.query(
      'INSERT INTO production_company (id, name) VALUES (?, ?)',
      [company.id || idx + 1, company.name],
      (err) => { if (err) console.error('Error insertando production_company:', err); }
    );
  });
}

// Insert genres
if (data.genre && data.genre.length) {
  data.genre.forEach((genre, idx) => {
    db.query(
      'INSERT INTO genre (id, name) VALUES (?, ?)',
      [genre.id || idx + 1, genre.name],
      (err) => { if (err) console.error('Error insertando genre:', err); }
    );
  });
}

// Insert actors
if (data.actor && data.actor.length) {
  data.actor.forEach(actor => {
    db.query(
      'INSERT INTO actor (id, name, image_actor, biography, date_of_birth) VALUES (?, ?, ?, ?, ?)',
      [actor.id, actor.name || '', actor.image_actor || '', actor.biography || '', actor.date_of_birth || null],
      (err) => { if (err) console.error('Error insertando actor:', err); }
    );
  });
}

// Insert movies
if (data.movie && data.movie.length) {
  data.movie.forEach(movie => {
    db.query(
      'INSERT INTO movie (id, title, description, release_year, photo_url, background_url, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [movie.id, movie.title || '', movie.description || '', movie.release_year || null, movie.photo_url || '', movie.background_url || '', movie.trailer_url || ''],
      (err) => { if (err) console.error('Error insertando movie:', err); }
    );
  });
}

// Insert movie_actor (movie_actors)
if (data.movie_actor && data.movie_actor.length) {
  data.movie_actor.forEach((ma, idx) => {
    db.query(
      'INSERT INTO movie_actors (id, id_movie, id_actor, character_name) VALUES (?, ?, ?, ?)',
      [ma.id || idx + 1, ma.id_movie, ma.id_actor, ma.character_name],
      (err) => { if (err) console.error('Error insertando movie_actors:', err); }
    );
  });
}

// Insert movie_genres
if (data.movie_genres && data.movie_genres.length) {
  data.movie_genres.forEach((mg, idx) => {
    db.query(
      'INSERT INTO movie_genres (id, id_movie, id_genre) VALUES (?, ?, ?)',
      [mg.id || idx + 1, mg.id_movie, mg.id_genre],
      (err) => { if (err) console.error('Error insertando movie_genres:', err); }
    );
  });
}

// Insert movie_production_companies
if (data.movie_production_companies && data.movie_production_companies.length) {
  data.movie_production_companies.forEach((mpc, idx) => {
    db.query(
      'INSERT INTO movie_production_companies (id, id_movie, id_company) VALUES (?, ?, ?)',
      [mpc.id || idx + 1, mpc.id_movie, mpc.id_company],
      (err) => { if (err) console.error('Error insertando movie_production_companies:', err); }
    );
  });
}

// Insert persona
if (data.persona && data.persona.length) {
  data.persona.forEach((persona, idx) => {
    db.query(
      'INSERT INTO persona (id, name, email, password, role, create_time) VALUES (?, ?, ?, ?, ?, ?)',
      [persona.id || idx + 1, persona.name || '', persona.email || '', persona.password || '', persona.role || '', persona.create_time || null],
      (err) => { if (err) console.error('Error insertando persona:', err); }
    );
  });
}

// Insert user
if (data.user && data.user.length) {
  data.user.forEach((user, idx) => {
    db.query(
      'INSERT INTO user (id_user, id_persona) VALUES (?, ?)',
      [user.id_user, user.id_persona],
      (err) => { if (err) console.error('Error insertando user:', err); }
    );
  });
}

// Insert user_save_movie
if (data.user_save_movie && data.user_save_movie.length) {
  data.user_save_movie.forEach((usm, idx) => {
    db.query(
      'INSERT INTO user_save_movie (id, save_data, id_user, id_movie) VALUES (?, ?, ?, ?)',
      [usm.id || idx + 1, usm.save_data || null, usm.id_user, usm.id_movie],
      (err) => { if (err) console.error('Error insertando user_save_movie:', err); }
    );
  });
}