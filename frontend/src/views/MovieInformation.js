import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../Components/NavComponent/Nav.js";

function Movie() {
  const location = useLocation();
  const id = location.state?.id_movie;
  const [viewModal, setViewModal] = useState(false);
  const [infoMovie, setInfoMovie] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [actors, setActors] = useState([]);
  const [idActorSelected, setIdActorSelected] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:8081/movie-id?id=${id}`)
      .then((res) => {
        setInfoMovie(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(`http://localhost:8081/movie-by-genres?id=${id}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(`http://localhost:8081/movie-by-companies?id=${id}`)
      .then((res) => {
        setCompanies(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    axios
      .get(`http://localhost:8081/actors-by-movie?id=${id}`)
      .then((res) => {
        setActors(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const buttonBgColors = {
    Acción: "bg-red-600",
    Terror: "bg-red-700",
    Aventura: "bg-rose-700",
    Bélica: "bg-blue-600",
    "Ciencia ficción": "bg-blue-700",
    Comedia: "bg-indigo-700",
    Crimen: "bg-purple-600",
    Documental: "bg-violet-700",
    Drama: "bg-green-600",
    Suspense: "bg-emerald-700",
    Misterio: "bg-yellow-700",
    Familia: "bg-orange-600",
    Fantasía: "bg-neutral-900",
  };

  function getButtonBgColor(color) {
    return buttonBgColors[color] || "bg-gray-800"; // color por defecto si no existe
  }

  const openModalActor = (id) => {
    const actor = actors.find((actor) => actor.id === id);
    if (actor) {
      setIdActorSelected(actor); // Esto está bien: guardas el objeto del actor completo
      setViewModal(true);
    }
  };

  const closeModalActor = () => {
    setIdActorSelected(null);
    setViewModal(false);
  };

  return (
    <div className="relative min-h-screen  text-white bg-black">
      {/* Componente de navegación */}
      <Nav />

      <div className="pt-[90px]">
        <div className="flex items-center justify-center">
          <div
            style={{
              backgroundImage: `url(/imagenesMovie/background/${infoMovie[0]?.background_url}.webp)`,
            }}
            className="relative  w-[1300px] h-[540px] flex items-center bg-cover bg-center bg-no-repeat z-20"
          >
            <div className="absolute w-[1300px] h-[540px] bg-black/60 z-10"></div>
            <div className="px-10 py-20 flex gap-20  w-full z-30">
              <img
                src={`/imagenesMovie/background/poster/${infoMovie[0]?.photo_url}.webp`}
                width={350}
                height={450}
                alt=""
                className="min-h-[450px] min-w-[350px] max-h-[450px] max-w-[350px]"
              />
              <div className="flex flex-col gap-2 w-full">
                <h2 className="text-4xl font-bold">{infoMovie[0]?.title}</h2>
                <p className="text-xs">
                  {infoMovie[0]?.release_year
                    ? new Date(infoMovie[0].release_year)
                        .toISOString()
                        .slice(0, 10)
                    : ""}
                </p>
                <p className="break-words max-w-[500px] text-justify ">
                  {infoMovie[0]?.description}
                </p>
                <div>Géneros</div>
                <div className="flex gap-4">
                  {categories?.map((element) => (
                    <span
                      className={`px-2 rounded ${getButtonBgColor(
                        element.name
                      )}`}
                      key={element.id}
                    >
                      {element.name}
                    </span>
                  ))}
                </div>
                <div>Compañias de producción</div>
                <div className="flex gap-3 text-white font-bold">
                  {companies?.map((element) => (
                    <span
                      className="border-b-2 border-red-600"
                      key={element.id}
                    >
                      {element.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-10 justify-center w-full font-bold pt-5">
                  <div className="bg-white/90 hover:bg-white/70 text-blue-700 px-3 py-2 rounded-md">
                    <a
                      href={infoMovie[0]?.trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full"
                    >
                      VER TRAILER
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      const section = document.getElementById("reparto");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="bg-red-600/85 px-3 py-2 rounded-md hover:bg-red-800"
                  >
                    VER REPARTO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 w-full" id="reparto">
        <p className=" text-center font-bold text-3xl bg-gradient-to-r from-black py-2 via-[#004B49] to-black">REPARTO</p>
        <div className="px-28 py-8 grid grid-cols-3 justify-items-center gap-10">
          {actors?.map((element) => (
            <span
              key={element.id}
              className="text-center bg-[#004B49] px-2 py-2 rounded-lg hover:opacity-70 hover:cursor-pointer"
              onClick={() => openModalActor(element.id)}
            >
              <img
                src={`/imagenesMovie/background/actors/${infoMovie[0]?.photo_url}/${element.image_actor}.webp`}
                alt=""
                width={300}
                height={350}
              />
              <p>{element.name}</p>
              <p className="text-xl text-lime-300 font-extrabold">
                {element.character_name}
              </p>
            </span>
          ))}
        </div>
      </div>
      {viewModal && idActorSelected && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full min-h-screen bg-black/80 z-50">
          <div className="flex gap-4 bg-white text-black p-6 rounded-lg w-[800px] transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 fixed">
            <img
              src={`/imagenesMovie/background/actors/${infoMovie[0]?.photo_url}/${idActorSelected.image_actor}.webp`}
              width={300}
              height={350}
              alt={idActorSelected.name}
              className="min-w-[300px]  min-h-[350px]"
            />
            <div className="flex flex-col gap-2 max-h-[80vh] overflow-auto">
              <p className="font-bold text-xl">{idActorSelected.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(idActorSelected.date_of_birth).toLocaleDateString(
                  "es-ES"
                )}
              </p>
              <p className="text-justify whitespace-pre-line">
                {idActorSelected.biography}
              </p>
            </div>
            <button
              className="absolute top-2 right-2 bg-red-600 rounded text-white px-2 text-2xl font-bold"
              onClick={closeModalActor}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movie;
