import { useState, useEffect } from "react";
import axios from "axios";

const TokenFetcher = () => {
  const [jwt, setJwt] = useState("");
  const url = "http://localhost:3000/admin/login";

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          url,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { message, token } = response.data;
        console.log(message); // Use or handle the message as needed
        localStorage.setItem(url, JSON.stringify(token));
        setJwt(token);
      } catch (error) {
        console.log(error);
      }
    };

    fetchToken();
  }, [url]);
};

export default TokenFetcher;
