import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import mainimage from "../assets/img/welcomebap.png";

class Dashboard extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <div>
                <img src={mainimage} width="1200" alt="main image" />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
