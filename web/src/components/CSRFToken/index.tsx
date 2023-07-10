import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const CSRFToken = () => {
  const [CSRFToken, setCSRFToken] = useState<string>("");

  useEffect(() => {
    async function getToken() {
      await axios
        .get("http://127.0.0.1:8000/api/auth/csrf", {
          withCredentials: true,
        })
        .then(() => {
          setCSRFToken(Cookies.get("csrftoken") as string);
        });
    }
    getToken();
  }, []);

  return (
    <input
      hidden
      type="csrfmiddleware"
      name="csrfmiddlewaretoken"
      value={CSRFToken}
    />
  );
};
