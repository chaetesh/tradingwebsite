import React, { useState } from "react";
import axios from "axios";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Notiflix from "notiflix";

function Register(props) {
  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
    cpassword: "",
  });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password.length < 5) {
      Notiflix.Notify.warning("Password Must be atleast 5 Charecters!");
      return;
    }
    if (credentials.password !== credentials.cpassword) {
      Notiflix.Notify.warning("Password Dosen't Match!!");
      return;
    }

    if (credentials.password === credentials.cpassword) {
      const response = await fetch(
        "http://localhost:5000/api/auth/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const json = await response.json();
      console.log(json);
      if (json.success === true) {
        navigate("/");
        Notiflix.Notify.success("SignUp Succesfull, please Login");
      }
    }
  };

  return (
    <div className="card">
      <form style={{ width: "50vw", marginLeft: "auto", marginRight: "auto" }}>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 text-white"
            >
              Name
            </label>
            <input
              onChange={onChange}
              name="name"
              type="text"
              id="first_name"
              style={{ width: "205%" }}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 text-white"
          >
            Email address
          </label>
          <input
            name="email"
            onChange={onChange}
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
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
            name="password"
            onChange={onChange}
            type="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label
            for="confirm_password"
            class="block mb-2 text-sm font-medium text-gray-900 text-white"
          >
            Confirm password
          </label>
          <input
            name="cpassword"
            onChange={onChange}
            type="password"
            id="confirm_password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <p id="helper-text-explanation" class="mt-4 mb-4 text-sm text-white">
          Already Registered? Click here to{" "}
          <Link
            to="/login"
            class="text-blue-600 hover:underline dark:text-blue-500"
          >
            Login
          </Link>
        </p>

        <button
          onClick={handleSubmit}
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;
