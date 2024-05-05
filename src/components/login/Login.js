import React, { useState } from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Notiflix from "notiflix";

function Login(props) {
  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // save the authtoken and redirect
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      Notiflix.Notify.success("Login Succesfull");
    } else {
      Notiflix.Notify.failure("Invalid Credentails!");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // let loginStatus = true;
  const validateUser = () => {
    //To check if a user is logged in or not.
  };

  return (
    <div className="card">
      <form style={{ width: "50vw", marginLeft: "auto", marginRight: "auto" }}>
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={onChange}
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={onChange}
          />
        </div>
        <p id="helper-text-explanation" class="mt-4 mb-4 text-sm text-white">
          Not Registered? Click here to{" "}
          <Link
            to="/register"
            class="text-blue-600 hover:underline dark:text-blue-500"
          >
            Register
          </Link>
        </p>

        <button
          type="submit"
          onClick={handleSubmit}
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
