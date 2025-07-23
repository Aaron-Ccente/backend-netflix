import express from "express";
import cors from "cors";
import db from "./db.js";
import { getAllMovies } from './models/movieModel.js';
import { createUser, assignRole, loginUser } from './models/userModel.js';

import { transformarPeliculas } from "./CleanMoviesData.js";
import { PORT } from './config.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

//Inserta los datos para el registro de nuevos usuarios
app.post("/signup", (req, res) => {
    createUser(req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ error: "Error inserting data into login" });
        }
        const userId = result.insertId;
        const role = req.body.role.toLowerCase();
        assignRole(userId, role, (roleErr) => {
            if (roleErr) {
                console.error(roleErr);
                return res.json({ error: "Error inserting into role-specific table" });
            }
            return res.json({ success: true, userId });
        });
    });
});

//Regresa el usuario que cumple con la condición ingresada (email y password)
app.post("/login", (req, res) => {
    loginUser(req.body, (err, data) => {
        if (err) {
            return res.json({ error: "Error select data" });
        }
        if (data.length > 0) {
            const user = { ...data[0] };
            delete user.password;
            return res.json({
                message: "Success",
                user: user
            });
        } else {
            return res.json("Failed");
        }
    });
});

app.get("/movies", (_, res) => {
  getAllMovies((err, results) => {
    if (err) {
      console.error("Error al obtener películas:", err);
      res.status(500).json({ error: "Error al obtener películas" });
    } else {
      res.status(200).json(results);
    }
  });
});

//consigue las relacioneas de la pelicula y sus generos
app.get("/movie_genrs",(_, res)=>{
  const query = `SELECT * FROM movie_genres`
  db.query(query, (err, result)=>{
    if (err) {
      console.error("Error al obtener películas con sus categorias:", err);
      res.status(500).json({ error: "Error al obtener películas con sus categorias" });
    } else {
      res.status(200).json(result);
    }
  })
});

//Obteniene todos los generos
app.get("/genre",(_, res)=>{
  const query = `SELECT * FROM genre ORDER BY id`;
  db.query(query, (err, result)=>{
    if(err){
      console.err("Error al obtener los generos de pelicula")
      res.status(500).json({ error: "Error al obtener los generos de las peliculas"})
    }else{
      res.status(200).json(result)
    }
  })
})

//Obtiene toda la información de una pelicula
app.get("/movie-id", (req, res)=>{
  const idMovie = req.query.id;//http://localhost:8081/movie-id?id=2
  const query = `SELECT * FROM movie WHERE id = ?`
  db.query(query, [idMovie], (err,result)=>{
    if(err){
      return res.status(500).json({ error: `"Error al obtener la pelicula con id ${idMovie}`})
    }
    else{
      res.status(200).json(result)
    }
  })
})

//Obtiene la pelicula y sus compañias de produccion
app.get("/movie-by-companies",(req, res)=>{
  const idMovie = req.query.id;
  const query = `SELECT production_company.* FROM production_company
  INNER JOIN movie_production_companies ON production_company.id = movie_production_companies.id_company
  WHERE movie_production_companies.id_movie = ?
  `;
  db.query(query, [idMovie], (err, result)=>{
    if(err){
      return res.status(500).json({ error: "No se pudo cargar las compañias productoras de la pelicula"});
    }
    else{
      res.status(200).json(result);
    }
  })
})

//Obtiene todos los generos
app.get("/movie-by-genres", (req, res) => {
  const idMovie = req.query.id; // por ejemplo: /movies-by-genre?id=1

  const query = `
    SELECT genre.* FROM genre
    INNER JOIN movie_genres ON genre.id = movie_genres.id_genre
    WHERE movie_genres.id_movie = ?
  `;

  db.query(query, [idMovie], (err, result) => {
    if (err) {
      console.error("Error al obtener los géneros y sus películas:", err);
      return res.status(500).json({ error: "Error al obtener los géneros de las películas" });
    } else {
      res.status(200).json(result);
    }
  });
});

//Obtiene todos los actores de una pelicula
app.get("/actors-by-movie", (req, res)=>{
  const idMovie = req.query.id; //http://actors-by-movie?id=2
  const query = `SELECT actor.*, character_name FROM actor
  INNER JOIN movie_actors ON actor.id = movie_actors.id_actor
  WHERE movie_actors.id_movie = ?`

db.query(query, [idMovie], (err, result)=>{
  if(err){
    return res.status(500).json({ error: "Error al cargar los actores con la pelicula."});
  }
  else{
    res.status(200).json(result);
  }
})
})

//Guarda pelicula seleccionada por el usuario
app.post("/user-save-movie",(req, res)=>{

  const { id_user, id_movie } = req.body;
  if (!id_user || !id_movie) {
  return res.status(400).json({ error: "Faltan datos necesarios" });
}
  const query = `INSERT INTO user_save_movie (id_user, id_movie) VALUES (?,?)`
  db.query(query, [id_user, id_movie], (err, result)=>{
    if(err){
      console.error("Error en DB:", err);
      return res.status(500).json({ error: "Error al guardar pelicula", err})
    }
    else{
      res.status(200).json({ message: "Success" })
    }
  })
})

//Para actualizar peliculas guardadas
app.get("/is-movie-saved", (req, res) => {
  const { id_movie, id_user } = req.query;
  const query = `SELECT * FROM user_save_movie WHERE id_movie = ? AND id_user = ?`;

  db.query(query, [id_movie, id_user], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar película" });
    } else {
      const isSaved = result.length > 0;
      res.status(200).json({ isSaved, result });
    }
  });
});

//Elimina pelicula guardada por el usuario
app.delete("/user-delete-movie/:id_user/:id_movie", (req, res) => {
  const { id_user, id_movie } = req.params; //user-delete-movie/5/6

  const query = `DELETE FROM user_save_movie WHERE id_user = ? AND id_movie = ?`;

  db.query(query, [id_user, id_movie], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar película", err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se eliminó ninguna fila" });
    }

    res.status(200).json({ message: "Deleted" });
  });
});

//Obtiene el id del usuario segun el id de la persona
app.get("/userId-of-person",(req, res)=>{
  const id_persona = req.query.id_persona;
  const query = `SELECT id_user FROM user WHERE id_persona=?`
  db.query(query, [id_persona], (err, result)=>{
    if(err){
      return res.status(500).json({ error: "Error al obtener el id del usuario", err})
    }else{
      res.status(200).json(result)
    }
  });
});

//Obtiene las peliculas favoritas del usuario
app.get("/favorite-saved-user", (req, res)=>{
  const id_user = req.query.id_user; //http://localhost:8081/favorite-saved-user?id_user=4
  const query = `SELECT id_user, id_movie, title, description, release_year, photo_url FROM user_save_movie 
  INNER JOIN movie ON user_save_movie.id_movie = movie.id
  WHERE id_user = ? `;
  db.query(query, [id_user], (err, result)=>{
    if(err){
      return res.status(500).json({ error: "Error al encontrar pelicula", err});
    }
    else{
      res.status(200).json(result);
    }
  });
});

//Obtiene toda la informacion de la tabla persona
app.get("/all-users", (_,res)=>{
  const query = `SELECT * FROM persona`
  db.query(query, (err,result)=>{
    if(err){
      return res.status(500).json({error: "Error al obtener todos los usuarios", err})
    }
    else{
      return res.status(200).json(result)
    }
  })
})

//Actualizar usuario por id - params
app.put("/update-user/:id",(req,res)=>{
  const {id}= req.params;
  const {name,email,password,phone} = req.body;
  const query = `UPDATE persona
                 SET name = ?,
                     email = ?,
                     password = ?,
                     phone = ?
                 WHERE id = ?`;
  db.query(query, [name,email,password,phone,id], (err,result)=>{
    if(err){
      return res.status(500).json({error: 'Error al actualizar el usuario', err})
    }
    else{
      return res.status(200).json(result)
    }
  })
})

//Eliminar usuario por id - params
app.delete("/delete-user/:id", (req,res)=>{
  const { id } = req.params; 
  const query = `DELETE FROM persona WHERE id = ?`
  db.query(query, [id], (err, result)=>{
    if(err){
      return res.status(500).json({error: "Error al eliminar usuario", err})
    }
    else{
      return res.status(200).json(result)
    }
  })
})

//-------------------------------------------------------------------------------------------------------------------
//Crear peliculas
app.post("/create-movie", (req, res) => {
  const {
    title, description, release_year, photo_url, background_url,
    trailer_url, movie_actors, movie_genre, movie_production_company
  } = req.body;

  // Validaciones básicas
  if (!movie_actors.length || !movie_genre.length || !movie_production_company.length) {
    return res.status(400).json({
      error: 'La película debe tener al menos un actor, género y compañía de producción'
    });
  }
  db.query("CALL createMovie(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      title,
      description,
      release_year,
      photo_url,
      background_url,
      trailer_url,
      JSON.stringify(movie_actors),
      JSON.stringify(movie_genre),
      JSON.stringify(movie_production_company)
    ], (err,result)=>{
      if(err){
        console.log('Error al ejecutar el procedimiento', err)
        return res.status(500).json({error: 'No se pudo crear la pelicula'})
      }
      else{
        return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
      }
    });
});

//Obtener todas las peliculas
app.get("/get-all-movies", (_,res)=>{
  const query = `CALL getAllMovies()`
  db.query(query, (err, result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiiento', err)
      return res.status(500).json({error: err.message || 'Error al obtener el procedimiento'})
    }
    else{
      const data = transformarPeliculas(result[0])
      return res.status(200).json(data)
    }
  })
})

//Actualizar una película
app.put("/update-movie/:id", (req, res)=>{
  const { id } = req.params;
  const {
    title, description, release_year, photo_url, background_url,
    trailer_url, movie_actors, movie_genre, movie_production_company
  } = req.body;

  const query = `CALL updateMovie(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [id, title, description, release_year, photo_url, background_url, trailer_url, JSON.stringify(movie_actors), JSON.stringify(movie_genre), JSON.stringify(movie_production_company)], (err, result) => {
    if (err) {
      console.log('Error al ejecutar el procedimiento', err);
      return res.status(500).json({ error: err.message || "Error al actualizar la película" });
    }
    return res.status(200).json({ success: true, message: result[0]?.[0]?.mensaje });
  });
});

//Eliminiar una película
app.delete("/delete-movie/:id", (req, res)=>{
    const { id } = req.params;
    const query = `CALL deleteMovie(?)`
    db.query(query, [id], (err, result)=>{
      if(err){
        console.log('Error al ejecutar el procedimiento', err)
        return res.status(500).json({ error: err.message || 'Error al eliminar la pelicula'})
      }
      else{
        return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
      }
    })
})

//-------------------------------------------------------------------------------------------------------------------
//Crear actores
app.post("/create-actor", (req, res) => {
    const { name, image_actor, biography, date_of_birth } = req.body;

    const query = `CALL createActor(?, ?, ?, ?)`;
    db.query(query, [name, image_actor, biography, date_of_birth], (err, result) => {
        if (err) {
            console.error("Error al ejecutar el procedimiento:", err);
            return res.status(500).json({ error: err.message || "Error al crear el actor" });
        }

        return res.json({
            success: true,
            message: result[0]?.[0]?.mensaje
        });
    });
});

//Obtener todos los actores
app.get("/get-all-actors", (_, res) => {
  const query = `CALL getAllActors()`;
  db.query(query, (err, result) => {
    if (err) {
      console.log('Error al ejecutar el procedimiento', err);
      return res.status(500).json({ error: err.message || "Error al obtener los actores" });
    }
    return res.status(200).json({ success: true, data: result[0], message: result[1]?.[0].mensaje });
  });
});

//Actualizar un actor
app.put("/update-actor/:id",(req,res)=>{
  const { id } = req.params;
  const { name, image_actor, biography, date_of_birth } = req.body;
  const query = `CALL updateActor(?,?,?,?,?)`;
  db.query(query, [id, name, image_actor, biography, date_of_birth ], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({ error: err.message || "Error al actualizar el actor"})
    }
    else{
      return res.status(200).json({
        success: true,
        message: result[0]?.[0]?.mensaje
      })
    }
  })
})

app.delete("/delete-actor/:id",(req,res)=>{
  const { id } = req.params;
  const query = `CALL deleteActor(?)`
  db.query(query, [id], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({ error: err.message || 'Error al eliminar actor'})
    }
    else{
      return res.status(200).json({ success: true, message: result[0]?.[0]?.mensaje})
    }
  })
})

//-------------------------------------------------------------------------------------------------------------------
//Obtener todos los generos de peliculas
app.get("/get-all-genres",(_,res)=>{
  const query = `CALL getAllGenres()`
  db.query(query, (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({error: err.message || "Error al obtener los generos" })
    }
    else{
      return res.status(200).json({success: true, data:result[0], message: result[1]?.[0].mensaje})
    }
  })
})

//Crear generos de peliculas
app.post("/create-genre",(req,res)=>{
  const { name } = req.body;
  const query = `CALL createGenre(?)`
  db.query(query, [name], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({error: err.message || "Error al crear un genero."})
    }
    else{
      return res.status(200).json({
        success: true,
        message: result[0]?.[0]?.mensaje
      })
    }
  })
})

//Actualizar el nombre de una categoria
app.put("/update-genre/:id",(req,res)=>{
  const { id } = req.params;
  const { name } = req.body;
  const query = `CALL updateGenre(?,?)`;
  db.query(query, [id, name], (err,result)=>{
    if(err){
      console.log('Error al ejecutar procedimiento', err)
      return res.status(500).json({error: err.message || "Error al actualizar la categoria"})
    }
    else{
      return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
    }
  })
})

//Eliminar una categori
app.delete("/delete-genre/:id",(req,res)=>{
  const { id } = req.params;
  const query = `CALL deleteGenre(?)`;
  db.query(query, [id], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({error: err.message || "Error al eliminar una categoria" })
    }
    else{
      return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
    }
  })
})

//-------------------------------------------------------------------------------------------------------------------
//Obtener todas las compañias usando PROCEDURE
app.get("/get-all-companies",(_,res)=>{
  const query = `CALL getAllCompanies()`
  db.query(query,(err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({error: err.message || "Error al obtener las compañias"})
    }
    else{
      return res.status(200).json({success: true,
            message: result[0]})
    }
  })
})

//Crear una compañia usando PROCEDURE
app.post("/create-company", (req,res)=>{
  const { name } = req.body;
  const query = `CALL createCompany(?)`;
  db.query(query, [name], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({error: err.message || "Error al crear una compañia"})
    }
    else{
      return res.status(200).json({
        success: true,
        message: result[0]?.[0]?.mensaje
      })
    }
  })
})

//actualizar el nombre de una compañia usando PROCEDURE
app.put("/update-company",(req,res)=>{
  const { id, name } = req.body 
  const query = `CALL updateCompany(?,?)`
  db.query(query, [id,name], (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento:', err)
      return res.status(500).json({error: err.message || "Error al actualizar la compañia"})
    }
    else{
      return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
    }
  })
})

//Eliminar una compañia usando PROCEDURE
 app.delete("/delete-company/:id",(req,res)=>{
    const { id } = req.params;
    const query = `CALL deleteCompany(?)`
    db.query(query, [id], (err,result)=>{
      if(err){
        console.log('Error al ejecutar el procedimiento', err)
        return res.status(500).json({ error: err.message || "Error al eliminar la compañia"})
      }
      else{
        return res.status(200).json({success: true, message: result[0]?.[0]?.mensaje})
      }
    })
 })

//-------------------------------------------------------------------------------------------------------------------
//Obtener generos, compañias productoras y actores - en todos solo el id y el nombre
app.get("/getGenreCompanyAndActors",(_, res)=>{
  const query = `CALL getAllGenreCompanyActorsForSelect()`
  db.query(query,(err,result)=>{
    if(err){
      console.log('Error al ejecutar procedimiento', err)
      return res.status(500).json({error: err.message})
    }
    else{
      return res.status(200).json(result[0]?.[0])
    }
  })
})

//Cantidad de generos de peliculas guardadas - para estadisticas
app.get("/stadistics-genres-count", (_, res)=>{
  const query = `CALL stadisticGenre()`
  db.query(query, (err,result)=>{
    if(err){
      console.log('Error al ejecutar el procedimiento', err)
      return res.status(500).json({ error: err.message  || 'Error al obtener la cantidad de usuarios que guardaron peliculas con los generos' })
    }
    else{
      return res.status(200).json({ success: true, data: result[0] })
    }
  })
})

//-------------------------------------------------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
