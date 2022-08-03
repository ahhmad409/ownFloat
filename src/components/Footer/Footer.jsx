import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import classes from "./Footer.module.scss";

class Footer extends Component {
  render() {
    return (
      <footer className={`footer ${classes.futter}`}>
        <Grid fluid>
          <nav className="pull-left" id={classes.laft}>
            <ul>
              <li>
                <a href="#">@Design &amp; develop by NKU Technologies</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://www.nkutechnologies.com/">NKU Technologies</a>
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
