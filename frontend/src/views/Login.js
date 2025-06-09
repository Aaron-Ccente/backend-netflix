import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validation } from "../Components/LoginComponents/LoginValidation.js";
import { useAuth } from "../context/AuthContext.js";
import axios from "axios";
import imageBackground from "../imagenes/backgroundGrande.webp";
import NavInLoginAndRegister from "../Components/NavComponent/NavInLoginAndRegister.js";
function Login() {
  const { login } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          if (res.data.message === "Success") {
            login(res.data.user);
            console.log(res.data.user);
            navigate("/home");
          } else {
            alert("La cuenta no existe.");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${imageBackground})` }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-center relative"
    >
      <NavInLoginAndRegister/>

      <div className="absolute h-screen bg-black/50 w-full z-10"></div>
      <div className="bg-black/60 border-2 px-10 py-6  border-red-900 p-3 rounded-xl  z-20 shadow-xl shadow-red-900">
        <h2 className="text-center font-bold text-2xl text-red-700 pb-4">Iniciar Sesión</h2>
        <form action="" onSubmit={handleSubmit} className="flex text-white flex-col gap-2 ">
          <div className="mb-3 flex flex-col  gap-4">
            <label htmlFor="email">
              <strong>Correo electrónico</strong>
            </label>
            <input
              type="email"
              placeholder="ejemplo: aronccente@gmail.com"
              onChange={handleInput}
              name="email"
              id="email"
              className="p-2 border-2 border-gray-200 text-black  focus:border-red-900 focus:outline-none rounded"
            />
            {errors.email && (
              <span className="text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="mb-3 flex flex-col gap-4">
            <label htmlFor="password">
              <strong>Contraseña</strong>
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              onChange={handleInput}
              name="password"
              id="password"
              className="p-2 border-2 border-gray-200 text-black focus:border-red-900 focus:outline-none rounded"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 border-2 border-red-900 hover:bg-white hover:text-red-900 text-white rounded  m-auto"
          >
            <strong>Iniciar Sesión</strong>
          </button>
          <div className="flex items-center justify-center gap-6  py-2">
            <p className="text-center">
           No tienes una cuenta? 
          </p>
          <Link
            to="/signup"
            className="border-b-2 border-white hover:border-red-900"
          >
            Crear Cuenta
          </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
