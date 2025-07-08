const express = require("express");
const cors = require("cors");
const db = require("./db");
const userModel = require("./models/userModel");
const movieModel = require("./models/movieModel");

const app = express();
app.use(cors());
app.use(express.json());


//Inserta los datos para el registro de nuevos usuarios
app.post("/signup", (req, res) => {
    userModel.createUser(req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ error: "Error inserting data into login" });
        }
        const userId = result.insertId;
        const role = req.body.role.toLowerCase();
        userModel.assignRole(userId, role, (roleErr) => {
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
    userModel.loginUser(req.body, (err, data) => {
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

app.get("/movies", (req, res) => {
  movieModel.getAllMovies((err, results) => {
    if (err) {
      console.error("Error al obtener películas:", err);
      res.status(500).json({ error: "Error al obtener películas" });
    } else {
      res.status(200).json(results);
    }
  });
});

//get the relationship of movie with its genrs
app.get("/movie_genrs",(req, res)=>{
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

//get the genrs
app.get("/genre",(req, res)=>{
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

// Taer toda la informacion de la pelicula
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


//get movie with production companies
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

//get movie with genrs
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


//Get actors (Repart) with their

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


//User saved movie in table user_save_movie
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

//The movie is saved?
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


//User delete movie saved in table user_save_movie
app.delete("/user-delete-movie/:id_user/:id_movie", (req, res) => {
  const { id_user, id_movie } = req.params;

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




//Get id user of Person loged
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


//Get favorite movies saved by user
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


// app.post("/signup", (req, res) => {
//     const sql = "INSERT INTO persona (`name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";
//     const values = [
//         req.body.name,
//         req.body.email,
//         req.body.password,
//         req.body.role
//     ];
//     db.query(sql, values, (err, data) => {
//         if (err) {
//             console.error(err); // Para depuración
//             return res.json({ error: "Error inserting data" });
//         }
//         return res.json({ success: true, data });
//     });
// });


//Añade la pertenencia de un actor con una movie

// app.post("/add-movie_actors", (req, res) => {
//   const movie_actors = Array.isArray(req.body) ? req.body : [req.body]; // Acepta 1 o muchas

//   const query = `
//     INSERT INTO movie_actors (id_movie, id_actor, character_name)
//     VALUES (?, ?, ?)
//   `;

//   const insertions = movie_actors.map(movie_actor => {
//     const { id_movie, id_actor, character_name } = movie_actor;
//     return new Promise((resolve, reject) => {
//       db.query(
//         query,
//         [id_movie, id_actor, character_name],
//         (err, result) => {
//           if (err) reject(err);
//           else resolve(result.insertId);
//         }
//       );
//     });
//   });

//   Promise.all(insertions)
//     .then(ids => res.status(200).json({ message: "Actores agregados a su pelicula", ids }))
//     .catch(err => {
//       console.error("Error al insertar actors con movie:", err);
//       res.status(500).json({ error: "Error al insertar actors con movie:" });
//     });
// });


//Añade actores a la tabla actor

// app.post("/add-actors", (req, res) => {
//   const actors = Array.isArray(req.body) ? req.body : [req.body]; // Acepta 1 o muchas

//   const query = `
//     INSERT INTO actor (name, image_actor)
//     VALUES (?, ?)
//   `;

//   const insertions = actors.map(actor => {
//     const { name, image_actor } = actor;
//     return new Promise((resolve, reject) => {
//       db.query(
//         query,
//         [name, image_actor],
//         (err, result) => {
//           if (err) reject(err);
//           else resolve(result.insertId);
//         }
//       );
//     });
//   });

//   Promise.all(insertions)
//     .then(ids => res.status(200).json({ message: "Actores agregados correctamente", ids }))
//     .catch(err => {
//       console.error("Error al insertar actores:", err);
//       res.status(500).json({ error: "Error al insertar actores:" });
//     });
// });


//Añade generos a la tabla production_company

// app.post("/add-production_company", (req, res) => {
//   const production_companies = Array.isArray(req.body) ? req.body : [req.body]; // Acepta 1 o muchas

//   const query = `
//     INSERT INTO production_company (name)
//     VALUES (?)
//   `;

//   const insertions = production_companies.map(production_company => {
//     const { name } = production_company;
//     return new Promise((resolve, reject) => {
//       db.query(
//         query,
//         [name],
//         (err, result) => {
//           if (err) reject(err);
//           else resolve(result.insertId);
//         }
//       );
//     });
//   });

//   Promise.all(insertions)
//     .then(ids => res.status(200).json({ message: "Compañias de produccion agregadas", ids }))
//     .catch(err => {
//       console.error("Error al insertar compañias de produccion:", err);
//       res.status(500).json({ error: "Error al insertar compañias de produccion:" });
//     });
// });


//Añade generos a la tabla genre

// app.post("/add-genre", (req, res) => {
//   const production_companies = Array.isArray(req.body) ? req.body : [req.body]; // Acepta 1 o muchas

//   const query = `
//     INSERT INTO genre (name)
//     VALUES (?)
//   `;

//   const insertions = production_companies.map(genre => {
//     const { name } = genre;
//     return new Promise((resolve, reject) => {
//       db.query(
//         query,
//         [name],
//         (err, result) => {
//           if (err) reject(err);
//           else resolve(result.insertId);
//         }
//       );
//     });
//   });

//   Promise.all(insertions)
//     .then(ids => res.status(200).json({ message: "Generos agregadas", ids }))
//     .catch(err => {
//       console.error("Error al insertar generos:", err);
//       res.status(500).json({ error: "Error al insertar generos" });
//     });
// });



//Añade peliculas en la tabla movie

// app.post("/add-movies", (req, res) => {
//   const movies = Array.isArray(req.body) ? req.body : [req.body]; // Acepta 1 o muchas

//   const query = `
//     INSERT INTO movie (title, description, release_year, photo_url, background_url, trailer_url)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   const insertions = movies.map(movie => {
//     const { title, description, release_year, photo_url, background_url, trailer_url } = movie;
//     return new Promise((resolve, reject) => {
//       db.query(
//         query,
//         [title, description, release_year, photo_url, background_url, trailer_url],
//         (err, result) => {
//           if (err) reject(err);
//           else resolve(result.insertId);
//         }
//       );
//     });
//   });

//   Promise.all(insertions)
//     .then(ids => res.status(200).json({ message: "Películas agregadas", ids }))
//     .catch(err => {
//       console.error("Error al insertar películas:", err);
//       res.status(500).json({ error: "Error al insertar películas" });
//     });
// });



//Actualizar la fecha de nacimiento y biografia
// app.put("/update-biografias", (req, res) => {
//   const actores = req.body; // Se espera un array de objetos: [{ id_actor, date_of_birth, biography }, ...]

//   if (!Array.isArray(actores) || actores.length === 0) {
//     return res.status(400).json({ error: "Se requiere un array de actores con id, date_of_birth y biography" });
//   }

//   const query = `
//     UPDATE actor
//     SET date_of_birth = ?, biography = ?
//     WHERE id = ?
//   `;

//   let errores = [];
//   let completados = 0;

//   actores.forEach(({ id, date_of_birth, biography }) => {
//     db.query(query, [date_of_birth, biography, id], (err, result) => {
//       completados++;

//       if (err) {
//         errores.push({ id, error: err.message });
//       }

//       // Enviar respuesta solo cuando se haya procesado todo
//       if (completados === actores.length) {
//         if (errores.length > 0) {
//           res.status(500).json({ message: "Actualización completada con errores", errores });
//         } else {
//           res.status(200).json({ message: "Todas las biografías actualizadas con éxito", result });
//         }
//       }
//     });
//   });
// });



app.listen(8081, () => {
    console.log("Server running on port 8081");
});
