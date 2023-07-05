import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CSRFToken = () => {
  const [CSRFToken, setCSRFToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("http://127.0.0.1:8000/api/auth/csrf");
    };

    fetchData();
    setCSRFToken(Cookies.get("csrftoken") as string);
  }, []);

  return (
    <input
      type="hidden"
      onChange={(e) => setCSRFToken(e.target.value)}
      value={CSRFToken}
    />
  );
};

export default CSRFToken;
