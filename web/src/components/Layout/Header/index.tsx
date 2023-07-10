import "./index.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

export const Header = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const CheckAuth = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      axios
        .get("http://127.0.0.1:8000/api/auth/authenticated", {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
          withCredentials: true,
        })
        .then((response) => {
          setAuthenticated(response.data.auth);
        });
    },
  });

  return (
    <main className="header">
      <div className="header__start">
        <Link to={"/"}>
          <h2 className="logo">{"</project-manager>"}</h2>
        </Link>
        <Link to={"/dashboard"}>
          <label className="header__item">Dashboard</label>
        </Link>
      </div>
      <div className="header__corner">
        <div className="user">
          {!authenticated && (
            <div>
              <Link to={"/login"}>
                <button className="login">Login</button>
              </Link>
            </div>
          )}
          {authenticated && (
            <Link to={"/developer"}>
              <AiOutlineUser size={32} />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};
