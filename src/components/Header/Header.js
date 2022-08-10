import React from "react";
import classes from "./Header.module.scss";

const Header = (props) => {
  const handleLogout = () => {
    localStorage.removeItem("ali123@gmail.com");
    props.setLoggedIn(false);
  };

  return (
    <div className={classes.topBar}>
      <p className={classes.fileHeading}>{props.text} </p>
      <p onClick={handleLogout}>Logout</p>
    </div>
  );
};

export default Header;
