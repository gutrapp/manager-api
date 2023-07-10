import { useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { RegisterData } from "../../types/register";
import { LoginData } from "../../types/login";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CSRFToken } from "../../components/CSRFToken";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const router = useNavigate();

  const [register, setRegister] = useState<RegisterData>({
    password: "",
    repassword: "",
    username: "",
  });

  const [login, setLogin] = useState<LoginData>({
    password: "",
    username: "",
  });

  const useLogin = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      await axios.post("http://127.0.0.1:8000/api/auth/login", login, {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      router("/");
    },
  });

  const useRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      if (
        register.password === register.repassword &&
        register.password &&
        register.repassword &&
        register.password
      ) {
        await axios.post(
          "http://127.0.0.1:8000/api/auth/register",
          {
            password: register.password,
            username: register.username,
          },
          {
            headers: {
              "X-CSRFToken": Cookies.get("csrftoken"),
            },
            withCredentials: true,
          }
        );
      }
    },
    onSuccess: () => {
      router("/");
    },
  });

  return (
    <main className="session">
      <CSRFToken />
      <h1>Login or Register</h1>
      <div className="session__form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            useRegister.mutate();
          }}
          className="form__register"
        >
          <h2>Register</h2>

          <div className="register__fields">
            <label>Username:</label>
            <input
              onChange={(e) =>
                setRegister({ ...register, username: e.target.value })
              }
              value={register.username}
              type="text"
              className="input__field"
            />

            <label>Password:</label>
            <input
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
              value={register.password}
              type="password"
              className="input__field"
            />

            <label>Confirm Password:</label>
            <input
              onChange={(e) =>
                setRegister({ ...register, repassword: e.target.value })
              }
              value={register.repassword}
              type="password"
              className="input__field"
            />

            <button className="button">Register</button>
          </div>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            useLogin.mutate();
          }}
          className="form__login"
        >
          <h2>Login</h2>

          <div className="login__fields">
            <label>Username:</label>
            <input
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
              value={login.username}
              type="text"
              className="input__field"
            />

            <label>Password:</label>
            <input
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              value={login.password}
              type="password"
              className="input__field"
            />

            <button className="button">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
};
