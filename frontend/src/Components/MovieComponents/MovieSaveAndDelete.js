import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Categoria({ name, release_year, image, id_movie, id_user }) {
  const navigate = useNavigate();

  const [savedModal, setSavedModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [savedSavedModal, setSavedSavedModal] = useState(false);
  const [savedDeleteModal, setSavedDeleteModal] = useState(false);

  const viewMovieInformation = (id_movie) => {
    navigate(`/movie/${id_movie}`, { state: { id_movie } });
  };
 useEffect(() => {
  axios
    .get(`http://localhost:8081/is-movie-saved?id_user=${id_user}&id_movie=${id_movie}&nocache=${new Date().getTime()}`)
    .then((res) => {
      if (res.data.isSaved) {
        setSavedModal(false);
        setDeleteModal(true);
      } else {
        setSavedModal(true);
        setDeleteModal(false);
      }
    })
    .catch((err) => {
      console.error("Error verificando si la película está guardada", err);
    });
}, [id_movie, id_user]);



  const saveMovie = (id_user, id_movie) => {
    const payload = { id_user, id_movie };
    axios
      .post("http://localhost:8081/user-save-movie", payload)
      .then((res) => {
        if (res.data.message === "Success") {
          setSavedModal(false);
          setDeleteModal(true);
          setSavedSavedModal(true);
          setTimeout(() => {
            setSavedSavedModal(false);
          }, 1000);
        } else {
          alert("Error al guardar película");
        }
      })
      .catch((err) => {
        
        alert("Error al guardar película");
      });
  };

  const deleteMovie = (id_user, id_movie) => {

    axios
      .delete(`http://localhost:8081/user-delete-movie/${id_user}/${id_movie}`)
      .then((res) => {
        if (res.data.message === "Deleted") {
          setDeleteModal(false)
          setSavedModal(true);
          setSavedDeleteModal(true);
          setTimeout(() => {
            setSavedDeleteModal(false);
          }, 1000);
        } else {
          alert("Error inesperado al eliminar película");
        }
      })
      .catch((err) => {
        alert("Error al eliminar película");
      });
  };

  return (
    <div className="relative text-xl text-white w-[300px] ">
      <img
        src={`/imagenesMovie/background/poster/${image}.webp`}
        className="hover:opacity-60 hover:cursor-pointer"
        width={300}
        height={400}
        onClick={() => viewMovieInformation(id_movie)}
        alt=""
      />
      <div>
        <p>{name}</p>
        <p className="text-end">{release_year}</p>
      </div>
      <div className="absolute flex top-1 right-1">
        {savedModal && (
          <div
            className="bg-blue-500 px-2 rounded cursor-pointer"
            onClick={() => saveMovie(id_user, id_movie)}
          >
            Guardar en favoritos
          </div>
        )}
        {deleteModal && (
          <div
            className="bg-red-600 px-2 rounded cursor-pointer"
            onClick={() => deleteMovie(id_user, id_movie)}
          >
            Eliminar de favoritos
          </div>
        )}
      </div>
      {savedSavedModal && (
        <div className="bg-green-600 text-center text-white w-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Se guardó exitosamente
        </div>
      )}
      {savedDeleteModal && (
        <div className="bg-red-600 text-center text-white w-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Se eliminó exitosamente
        </div>
      )}
    </div>
  );
}

export default Categoria;

