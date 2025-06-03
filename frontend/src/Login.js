import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validation } from "./LoginValidation.js";
import { useAuth } from "./context/AuthContext.js";
import axios from "axios";
import imageBackground from './imagenes/backgroundGrande.webp'
function Login() {
    const { login } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
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

    if (
      !validationErrors.email &&
      !validationErrors.password
    ) {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => 
        {
            if(res.data.message === "Success" ){
                login(res.data.user);
                console.log(res.data.user);
                navigate('/home')
            } else {
                alert("La cuenta no existe.");
            }
        }
        )
        .catch((err) => console.log(err));
    }
  };

  return (
    <div
    style={{ backgroundImage: `url(${imageBackground})` }}
    className="flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-center relative">
      <div className="absolute h-screen bg-black/30 w-full z-10"></div>
      <div className="bg-white p-3 rounded w-96 z-20">
        <h2 className="text-center font-bold text-xl">Sign In</h2>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="mb-3 flex flex-col ">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              onChange={handleInput}
              name="email"
              id="email"
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
              onChange={handleInput}
              name="password"
              id="password"
              className="p-2 border-2 border-gray-200  focus:border-sky-400 focus:outline-none rounded"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded w-20 m-auto"
          >
            <strong>Log In</strong>
          </button>
          <p className="text-center">
            You are agree to aour terms and policies
          </p>
          <Link
            to="/signup"
            className="px-4 py-2 bg-gray-500 rounded w-40 m-auto text-center"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
