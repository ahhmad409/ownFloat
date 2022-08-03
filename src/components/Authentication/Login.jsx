import React, { Component } from "react";
import "./Login.css";

const Login = (props) => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handlelogin,
    handlesignup,
    hasaccount,
    setHasAccount,
    emailError,
    passwordError,
  } = props;
  return (
    <section className="login">
      <div className="loginContainer">
        <label>User name</label>
        <input
          type="text"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="errorMsg">{emailError}</p>
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="errorMsg">{passwordError}</p>
        <div className="btnContainer">
          <>
            <button onClick={handlelogin}>Sign In</button>
          </>
        </div>
      </div>
    </section>
  );
};

export default Login;
