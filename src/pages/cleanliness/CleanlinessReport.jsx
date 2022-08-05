import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import classes from "./CleanlinessReport.module.scss";

const CleanlinessReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedFloat, setSelectedFloat] = useState("");

  const searchHandler = () => {
    console.log("Search the data");
  };

  const handleLogout = () => {
    localStorage.removeItem("ali123@gmail.com");
    setLoggedIn(false);
  };

  return (
    <div className={classes.wrapperr}>
      <div className={classes.topBar}>
        <p className={classes.fileHeading}>Cleanliness Report </p>
        <p onClick={handleLogout}>Logout</p>
      </div>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          Cleanliness Report
        </p>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Label>Select Float</Form.Label>
              <Form.Select
                defaultValue={""}
                aria-label="Default select example"
                onChange={(e) => {
                  setSelectedFloat(e.target.value);
                }}
              >
                <option value="" disabled>
                  --Please-select-Float
                </option>
                <option value="1">All Floats</option>
                <option value="2">float 1</option>
                <option value="3">float 2</option>
              </Form.Select>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              ></Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="warning"
                onClick={searchHandler}
                className={classes.searchBtn}
                disabled={!fromDate || !toDate || !selectedFloat}
              >
                Search
              </Button>
            </Col>
          </Row>
          {loading ? (
            <p className={classes.noDataText}>Loading...</p>
          ) : !dataExists ? (
            <p className={classes.noDataText}>No Data</p>
          ) : serverError ? (
            <p className={classes.noDataText}>Something went wrong!</p>
          ) : (
            <div className={`table-responsive ${classes.tableResponsive}`}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>date</th>
                    <th>time</th>
                    <th>user</th>
                    <th>image</th>
                    <th>location</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {[].map((item) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{item.brand}</td>
                        <td>{item.id}</td>
                        <td>{item.date}</td>
                        <td>{item.userId}</td>
                        <td>{item.stockLoad}</td>
                      </tr>
                    );
                  })} */}
                  <tr>
                    <td>dsadsa</td>
                    <td>dsadsa</td>
                    <td>dsadsa</td>
                    <td>dsadsa</td>
                    <td>dsadsa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default CleanlinessReport;
