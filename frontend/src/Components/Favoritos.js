import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../NavComponent/Nav";
import axios from "axios";

function Favoritos() {
  const location = useLocation();
  const id_persona = location?.state.id;
  const [movies, setMovies] = useState([]);
  const isSave = movies?.length>0? false: true;
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:8081/favorite-saved-user?id_user=${id_persona}`)
      .then((res) => {
        setMovies(res.data);
        
      })
      .catch((err) => console.log("Error: ", err));
  }, [id_persona]);

  const deleteFavoriteMovie = (id_user, id_movie) =>{
    
    axios
    .delete(`http://localhost:8081/user-delete-movie/${id_user}/${id_movie}`)
    .then((res)=>{
      if(res.data.message==="Deleted"){
        alert("Pelicula eliminada")
        setMovies(prev => prev.filter(m => m.id_movie !== id_movie));
        
      }
      
    })
    .catch((err)=>{
      alert("ERROR")
      console.log(err)
    })
  }
 const handleViewMoreInformation = (id_movie) =>{
  navigate(`/movie/${id_movie}`, {state: {id_movie}})
 }

  return (
    <div className="bg-black min-h-screen text-white pb-10">
      <Nav />
      <div className="pt-[90px] grid justify-items-center">
        <div className="mt-10 py-2 w-full text-center font-bold text-2xl bg-gradient-to-r from-black via-red-600 to-black">
          FAVORITOS
        </div>

        <div className="grid grid-cols-2 max-w-[1200px] gap-6 justify-items-center mt-8 text-center">
          {movies?.map((element) => (
            <div className="w-full" key={element.id}>
              <div className={`flex gap-2 px-4 py-4 justify-center border-2 border-white`}>
                <img
                  src={`/imagenesMovie/background/poster/${element.photo_url}.webp`}
                  width={200}
                  height={300}
                  className="max-h-[300px] max-w-[200px]"
                  alt=""
                />
                <div className="w-1/2 grid gap-3">
                  <p className="font-bold">{element.title}</p>
                  <p className="text-start">
                    {new Date(element.release_year).toISOString().slice(0, 10)}
                  </p>
                  <p
                    className="text-justify h-[190px] overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 8,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {element.description}
                  </p>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-red-600  h-[30px] px-2 text-white"
                      onClick={()=>deleteFavoriteMovie(element.id_user, element.id_movie)}
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      className="bg-white px-2 h-[30px] text-black"
                      onClick={()=>handleViewMoreInformation(element.id_movie)}
                    >
                      Ver información
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isSave && <div className="text-center ">No tiene ninguna pelicula favorita.</div>}
    </div>
  );
}

export default Favoritos;
