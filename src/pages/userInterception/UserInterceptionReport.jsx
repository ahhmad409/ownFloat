import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import classes from "./UserInterceptionReport.module.scss";
const UserInterceptionReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const searchHandler = () => {
    console.log("Search the data");
  };

  return (
    <div className={classes.wrapperr}>
      <p className={classes.fileHeading}>User Interception Report</p>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          User Interception Report
        </p>
        <Container fluid>
          <Row>
            <Col>
              <label>From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </Col>
            <Col>
              <label>To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </Col>
            <Col>
              <Form.Select aria-label="Default select example">
                <option>Select User</option>
                <option value="1">All Users</option>
                <option value="2">user1</option>
                <option value="3">user2</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="warning"
                onClick={searchHandler}
                className={classes.searchBtn}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
};

export default UserInterceptionReport;
