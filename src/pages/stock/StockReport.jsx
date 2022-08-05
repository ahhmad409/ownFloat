import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import classes from "./StockReport.module.scss";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const StockReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [stockLoad, setStockLoad] = useState([]);

  const searchHandler = () => {
    getStockLoad();
  };

  const getStockLoad = async () => {
    setLoading(true);
    // prettier-ignore
    try{
    const res = await axios.post("https://blazorwithfirestore-server.conveyor.cloud/api/StockLoad/Get", { date: null, userId: null, } );
    const data = res.data.data; 
    
    setStockLoad(data);
    setDataExists(true);
    setServerError(false);

  }catch(err){
    console.log("Error occured==========> ", err);
    setServerError(true);
    setDataExists("Something went wrong");
  }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("ali123@gmail.com");
    setLoggedIn(false);
  };

  return (
    <div className={classes.wrapperr}>
      <div className={classes.topBar}>
        <p className={classes.fileHeading}>StockReport </p>
        <p onClick={handleLogout}>Logout</p>
      </div>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          Stock Report
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
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="warning"
                onClick={searchHandler}
                className={classes.searchBtn}
                disabled={!fromDate || !toDate}
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
                    <th>brand</th>
                    <th>id</th>
                    <th>date</th>
                    <th>userID</th>
                    <th>stockLoad</th>
                  </tr>
                </thead>
                <tbody>
                  {stockLoad.map((item) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{item.brand}</td>
                        <td>{item.id}</td>
                        <td>{item.date}</td>
                        <td>{item.userId}</td>
                        <td>{item.stockLoad}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default StockReport;
