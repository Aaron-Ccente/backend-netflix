import { Link, useNavigate } from "react-router-dom";
import { validation } from "./SignupValidation";
import { useState } from "react";
import axios from "axios";
import imageBackground from './imagenes/backgroundGrande.webp'
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
      <div className="w-full h-screen absolute bg-black/50"></div>
      <div className="bg-white p-3 rounded w-96 z-20">
        <h2 className="text-center font-bold text-xl">Sign Up</h2>
        <form action="" className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="mb-3 flex flex-col ">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              onChange={handleInput}
              name="name"
              id="name"
              className="p-2 border-2 border-gray-200  focus:border-sky-400 focus:outline-none rounded"
            />
            {errors.name && <span className="text-red-600">{errors.name}</span>}
          </div>
          <div className="mb-3 flex flex-col ">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              id="email"
              onChange={handleInput}
              className="p-2 border-2 border-gray-200  focus:border-sky-400 focus:outline-none rounded"
            />
            {errors.email && (
              <span className="text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="mb-3 flex flex-col">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              id="password"
              onChange={handleInput}
              className="p-2 border-2 border-gray-200  focus:border-sky-400 focus:outline-none rounded"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password}</span>
            )}
          </div>
          <div>
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
            className="px-4 py-2 bg-green-600 text-white rounded w-40 m-auto"
          >
            <strong>Create Account</strong>
          </button>
          <p className="text-center">
            You are agree to aour terms and policies
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-500 rounded w-40 m-auto text-center"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
