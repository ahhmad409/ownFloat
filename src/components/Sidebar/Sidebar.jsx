import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "./sidebar.module.scss";
import logo from "./logo.png";

const Sidebar = () => {
  return (
    <nav className={classes.navContainer}>
      <div className={classes.logo}>
        <img src={logo} alt="logo_image" />
      </div>
      <ul className={classes.navlist}>
        <li>
          <NavLink
            to="/user-interception-report"
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "rgba(255,255,255,0.23)" : "",
              };
            }}
          >
            <i className="bi bi-printer"></i>
            User Interception Report
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/stock-report"
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "rgba(255,255,255,0.23)" : "",
              };
            }}
          >
            <i className="bi bi-printer"></i>
            Stock Report
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/attendance-report"
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "rgba(255,255,255,0.23)" : "",
              };
            }}
          >
            <i className="bi bi-printer"></i>
            Attendance Report
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cleanliness-report"
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "rgba(255,255,255,0.23)" : "",
              };
            }}
          >
            <i className="bi bi-printer"></i>
            Cleanliness Report
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/customer-feedback-report"
            // className={classes.disabledLink}
            style={({ isActive }) => {
              return {
                backgroundColor: isActive ? "rgba(255,255,255,0.23)" : "",
              };
            }}
          >
            <i className="bi bi-printer"></i>
            Customer Feedback Report
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
