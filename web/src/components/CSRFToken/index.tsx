import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const CSRFToken = () => {
  const [CSRFToken, setCSRFToken] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["csrftoken"],
    queryFn: async () => {
      await axios.get("http://127.0.0.1:8000/api/auth/csrf", {
        withCredentials: true,
      });

      setCSRFToken(Cookies.get("csrftoken") as string);
      return Cookies.get("csrftoken");
    },
  });

  console.log(data);

  return (
    <input
      hidden
      type="csrfmiddleware"
      name="csrfmiddlewaretoken"
      value={CSRFToken}
    />
  );
};

export default CSRFToken;
