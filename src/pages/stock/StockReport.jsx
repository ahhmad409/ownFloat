import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
// import classes from "./StockReport.module.scss";

const StockReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [stockLoad, setStockLoad] = useState([]);

  const exportedTableHeaders = [
    { label: "User ID", key: "data.date" },
    { label: "From", key: "data.time" },
    { label: "To", key: "data.territoryName" },
    { label: "Brand", key: "data.town" },
    { label: "Opening", key: "data.userId" },
    { label: "Load Stock", key: "data.name" },
    { label: "Sale", key: "data.cnic" },
    { label: "Balance", key: "data.cellNo" },
  ];

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
                    <th>User ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Brand</th>
                    <th>Opening</th>
                    <th>Load Stock</th>
                    <th>Sale</th>
                    <th>Balance</th>
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
          {dataExists ? (
            <CSVLink
              data={stockLoad}
              filename={"StockReport.csv"}
              headers={exportedTableHeaders}
              className={`${classes.downloadBtn}`}
            >
              Download Data
            </CSVLink>
          ) : null}
        </Container>
      </Card>
    </div>
  );
};

export default StockReport;
