import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getToken from "../utils/getToken.js";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [isUser, setIsUser] = useState(true);
  const [user, setUser] = useState({});
  const redirectTo = useNavigate();

  const submitRegister = async (
    userName,
    email,
    password,
    role,
    profilePicture
  ) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("userName", userName ? userName : email);
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    urlencoded.append("role", role);
    urlencoded.append(
      "profilePicture",
      profilePicture
        ? profilePicture
        : "http://res.cloudinary.com/dtwbyjspa/image/upload/v1669821358/images/yk4xc69svkglrejjq3tk.png"
    );

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      redirectTo("/login");
    } catch (error) {
      console.log("error", error);
    }
  };

  const submitLogin = async (email, password) => {
    console.log("userLogin", email, password);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      console.log("result", result.token);
      const { user } = result;
      setUser(user);
      const { token } = result;
      if (token) {
          localStorage.setItem("token", token);
          setIsUser(true);
          setUser(result.user);
          redirectTo("/expeditions");
        }
      if (!token || !user) {
        alert("user not found with this email, register first?");
      }
    } catch (error) {
      setIsUser(false);
      console.log("error", error);
    }
  };
  
  const getProfile = async () => {
    const token = getToken();

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      setUser(result);
    } catch (error) {
      console.log("error >", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setIsUser(false);
    redirectTo("/");
  };

  useEffect(() => {
    console.log("useEffect run");
    getToken();
    console.log("isUser :>> ", isUser);
  }, [isUser]);

  return (
    <AuthContext.Provider
      value={{
        getToken,
        isUser,
        setIsUser,
        submitRegister,
        submitLogin,
        logOut,
        user,
        getProfile,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
