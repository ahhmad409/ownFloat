import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import Login from "../components/Authentication/Login";

import routes from "../routes.js";

const Admin = () => {
  const [image, setImage] = useState("");
  const [color, setColor] = useState("orange");
  const [hasImage, setHasImage] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState("");
  const [loading, setLoading] = useState("");

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => (
              <prop.component
                {...props}
                handleClick={this.handleNotificationClick}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  if (this.state.loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: "30px",
        }}
      >
        Loading....
      </div>
    );
  } else if (this.state.user) {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
        />
        <div
          id="main-panel"
          className="main-panel"
          ref="mainPanel"
          style={{ height: "100%", overflow: "scroll", transform: "none" }}
        >
          <AdminNavbar
            {...(this.props ? "TRUE" : "FALSE")}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  } else
    return (
      <div style={{ textAlign: "center" }}>
        <Login
          email={email}
          password={password}
          setEmail={(event) => this.setEmailHandler(event)}
          setPassword={(event) => this.setPasswordHandler(event)}
          handlelogin={this.handleLogin}
          handlesignup={this.handleSignUp}
          hasaccount={this.hasAccount}
          setHasAccount={this.toggleHandler}
          emailError={this.state.emailError}
          passwordError={this.state.passwordError}
        />
      </div>
    );
};

export default Admin;
