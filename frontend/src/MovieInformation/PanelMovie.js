import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PanelMovie({ id, backgroundImage, posterImage }) {
  const infoID = id;
  const [infoMovie, setInfoMovie] = useState([]);
  const [category, setCategories] = useState([]);
  const [company, setCompanies] =useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8081/movie-id?id=${infoID}`)
      .then((res) => {
        setInfoMovie(res.data);
      })
      .catch((err) => console.error(err));
    axios
    .get(`http://localhost:8081/movie-by-genres?id=${infoID}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(`http://localhost:8081/movie-by-companies?id=${infoID}`)
      .then((res)=>{
        setCompanies(res.data);
      })
      .catch((err)=>{
        console.error(err)
      })
  }, [infoID]);

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
  const navigate = useNavigate();
  const viewMoreInformation = (id_movie) => {
    navigate(`/movie/${id_movie}`, { state: { id_movie } });
  };
  return (
    <>
      <div
        style={{
          backgroundImage: `url(/imagenesMovie/background/${backgroundImage}.webp)`,
        }}
        className="relative w-[1300px] h-[540px] flex items-center bg-cover bg-center bg-no-repeat z-20"
      >
        <div className="absolute w-[1300px] h-[540px] bg-black/60 z-10"></div>
        <div className="px-10 py-20 flex gap-20  w-full z-30">
          <img
            src={`/imagenesMovie/background/poster/${posterImage}.webp`}
            width={350}
            height={450}
            alt=""
            className="min-h-[450px] min-w-[350px] max-h-[450px] max-w-[350px]"
          />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-4xl font-bold">{infoMovie[0]?.title}</h2>
            <p className="text-xs">
              {infoMovie[0]?.release_year
                ? new Date(infoMovie[0].release_year).toISOString().slice(0, 10)
                : ""}
            </p>
            <p className="break-words max-w-[500px] text-justify ">
              {infoMovie[0]?.description}
            </p>
            <div>Géneros</div>
            <div className="flex gap-4">
              {category?.map((element) => (
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
              {company?.map((element)=><span className="border-b-2 border-red-600" key={element.id}>{element.name}</span>)}
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
                className="bg-red-600/85 px-3 py-2 rounded-md hover:bg-red-800"
                onClick={() => viewMoreInformation(id)}
              >
                VER INFORMACIÓN
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PanelMovie;
