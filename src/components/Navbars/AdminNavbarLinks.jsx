import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import fire from "../../helpers/fire";

class AdminNavbarLinks extends Component {
  handleLogout = () => {
    fire.auth().signOut();
  };
  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={3} onClick={this.handleLogout}>
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
