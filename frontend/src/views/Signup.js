import { Link, useNavigate } from "react-router-dom";
import { validation } from "../Components/SignUpComponents/SignupValidation";
import { useState } from "react";
import axios from "axios";
import imageBackground from '../imagenes/backgroundGrande.webp'
import NavInLoginAndRegister from "../Components/NavComponent/NavInLoginAndRegister";
function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "usuario",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    console.log(values)
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (
      !validationErrors.name &&
      !validationErrors.email &&
      !validationErrors.password
    ) {
      axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          console.log(res)
          navigate("/")})
        .catch((err) => console.log(err));
    }
  };

  return (
    <div 
    style={{ backgroundImage: `url(${imageBackground})` }}
    className="flex flex-col items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover relative">
      <NavInLoginAndRegister/>
    <div className="w-full h-screen absolute bg-black/50 "></div>
      <div className="bg-black/60 border-2 px-10 py-6 text-white  border-red-900 p-3 rounded-xl  z-20 shadow-xl shadow-red-900">
        <h2 className="text-center font-bold text-2xl text-red-700 pb-4">Crear Cuenta</h2>
        <form action="" className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="mb-3 flex flex-col gap-4 ">
            <label htmlFor="name">
              <strong>Nombre</strong>
            </label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              onChange={handleInput}
              name="name"
              id="name"
               className="p-2 border-2 border-gray-200 text-black  focus:border-red-900 focus:outline-none rounded"
            />
            {errors.name && <span className="text-red-600">{errors.name}</span>}
          </div>
          <div className="mb-3 flex flex-col gap-4">
            <label htmlFor="email">
              <strong>Correo electrónico</strong>
            </label>
            <input
              type="email"
              placeholder="Ejemplo: aronccente@gmail.com"
              name="email"
              id="email"
              onChange={handleInput}
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
              placeholder="Contraseña"
              name="password"
              id="password"
              onChange={handleInput}
              className="p-2 border-2 border-gray-200 text-black  focus:border-red-900 focus:outline-none rounded"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password}</span>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <label>
              <input
                type="radio"
                name="role"
                value="usuario"
                checked={values.role === "usuario"}
                onChange={handleInput}
              />
              Usuario
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="administrador"
                checked={values.role === "administrador"}
                onChange={handleInput}
              />
              Administrador
            </label>
          </div>
          <button
            type="submit"
             className="px-4 py-2 border-2 border-red-900 hover:bg-white hover:text-red-900 text-white rounded  m-auto"
          >
            <strong>Crear Cuenta</strong>
          </button>
          <div className="flex items-center justify-center gap-4">
            <p className="text-center">
            Si ya tienes una cuenta haz click en
          </p>
          <Link
            to="/"
            className="border-b-2 border-white hover:border-red-900"
          >
            Iniciar Sesión
          </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Signup;
