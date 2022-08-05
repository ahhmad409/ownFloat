import React, { useState, useEffect } from "react";
import classes from "./Login.module.scss";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "ali123@gmail.com" && password === "ali123") {
      localStorage.setItem("ali123@gmail.com", "ali123");
      setLoggedIn(true);
      navigate("/user-interception-report");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className={classes.formContainer}>
      <div className={classes.formControl}>
        <label htmlFor="username">Username*</label>
        {/* prettier-ignore */}
        <input type="text" autoFocus placeholder="username@example.com" value={username} required onChange={(e)=>{setUsername(e.target.value)}}/>
      </div>
      <div className={classes.formControl}>
        <label htmlFor="password">Password*</label>
        {/* prettier-ignore */}
        <input type="password" placeholder="password"  required value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </div>
      <div className={classes.formControl}>
        <button className={classes.loginButton} onClick={handleLogin}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
