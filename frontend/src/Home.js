import { useEffect, useState } from "react";
import axios from "axios";
import Categoria from "./Categoria";
import PanelMovie from "./MovieInformation/PanelMovie";
import Nav from "./NavComponent/Nav";
import { useAuth } from "./context/AuthContext";
function Home() {
  
  const [movies, setMovies] = useState([]);
  const [genre, setGenres] = useState([]);
  const [movie_genre, setMovieGenres] = useState([]);
  const [idUser, setIdUser ] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    
    axios.get("http://localhost:8081/movies").then((res) => {
      setMovies(res.data);
    });
    axios.get("http://localhost:8081/genre").then((res) => {
      setGenres(res.data);
    });
    axios.get("http://localhost:8081/movie_genrs").then((res) => {
      setMovieGenres(res.data);
    });
    axios.get(`http://localhost:8081/userId-of-person?id_persona=${user?.id}`)
    .then((res)=>setIdUser(res.data))
    .catch((err)=>console.error(err))
  }, [user?.id]);
  const randomIndex = Math.floor(Math.random() * movies?.length);

  return (
    
    <div className="relative min-h-screen bg-black text-white">
      <Nav/>
      <div className="pt-[90px] text-white">
        <div className="flex items-center justify-center">
          
          <PanelMovie  
          id={movies[randomIndex]?.id} 
          backgroundImage={movies[randomIndex]?.background_url}
          posterImage = {movies[randomIndex]?.photo_url} />
          
        </div>
      </div>

      <div className="pt-20">
        <h3 className="text-center font-bold text-2xl py-2 bg-red-600 bg-gradient-to-r from-black via-red-600 to-black ">CATEGORIAS</h3>
        <div className="px-28 py-8">
          {genre?.map((g) => {
            // Encuentra todos los id_movie que pertenecen a este género
            const movieIds = movie_genre
              .filter((mg) => mg.id_genre === g.id)
              .map((mg) => mg.id_movie);

            // Filtra las películas cuyo id esté en movieIds
            const filteredMovies = movies.filter((m) =>
              movieIds.includes(m.id)
            );

            return (
              <div key={g.id}>
                <p className="text-3xl font-semibold my-4 text-red-600">
                  {g.name}
                </p>
                <div className="flex gap-8 overflow-x-auto">
                  {filteredMovies.map((movie) => (
                    <div key={movie.id}>
                      <Categoria
                        id_movie={movie.id}
                        name={movie.title}
                        release_year={new Date(movie.release_year)
                          .toISOString()
                          .slice(0, 10)}
                        image={movie.photo_url}
                        id_user={idUser[0]?.id_user}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
