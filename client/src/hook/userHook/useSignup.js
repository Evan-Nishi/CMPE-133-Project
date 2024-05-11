// useSignup.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setError(null);
    const response = await fetch("/createAccount", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      dispatch({ type: "LOGIN", payload: json });
      navigate("/");
    }
  };
  return { signup, error };
};

export default useSignup;
