import { useMutation, useQuery } from "@tanstack/react-query";
import { Layout } from "../../components/Layout";
import "./index.css";
import axios from "axios";
import { useState } from "react";
import { Developer } from "../../types/developer";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Profile = () => {
  const [username, setUsername] = useState<string>("");
  const router = useNavigate();
  const [developer, setDeveloper] = useState<Developer>({
    age: "",
    email: "",
    first_name: "",
    last_name: "",
    id: 0,
  });

  const UseSession = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      await axios
        .get("http://127.0.0.1:8000/api/developer/session", {
          withCredentials: true,
        })
        .then((response) => {
          setUsername(response.data.user.username);
          setDeveloper(response.data.developer);
        });
    },
  });

  const UpdateDeveloper = useMutation({
    mutationKey: ["update-developer"],
    mutationFn: async () => {
      await axios.put(
        "http://127.0.0.1:8000/api/developer/" + developer.id,
        {
          ...developer,
          age: parseInt(developer.age),
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      );
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const LogOut = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await axios.delete("http://127.0.0.1:8000/api/auth/logout", {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
    },
    onSuccess: () => {
      router("/");
    },
  });

  return (
    <Layout>
      <main className="home">
        <div>
          <h1 className="edit">Hello, {username}</h1>
          <p className="edit__p">
            This page let's you edit what others see when they click on your
            profile
          </p>
          <form className="user-form">
            <div>
              <label className="label">First Name:</label>
              <input
                className="input"
                type="text"
                value={developer.first_name}
                onChange={(e) => {
                  setDeveloper({ ...developer, first_name: e.target.value });
                }}
              />

              <label className="label">Last Name:</label>
              <input
                className="input"
                type="text"
                value={developer.last_name}
                onChange={(e) => {
                  setDeveloper({ ...developer, last_name: e.target.value });
                }}
              />

              <label className="label">Email:</label>
              <input
                className="input"
                type="text"
                value={developer.email}
                onChange={(e) => {
                  setDeveloper({ ...developer, email: e.target.value });
                }}
              />

              <label className="label">Age:</label>
              <input
                className="input"
                type="text"
                value={developer.age.toString()}
                onChange={(e) => {
                  setDeveloper({ ...developer, age: e.target.value });
                }}
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                UpdateDeveloper.mutate();
              }}
              className="button"
            >
              Save Changes
            </button>
          </form>

          <div className="logout">
            <label>Do you want to logout?</label>
            <button
              onClick={(e) => {
                e.preventDefault();
                LogOut.mutate();
              }}
              className="button__logout"
            >
              Log out
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
