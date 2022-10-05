import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
// import classes from "./StockReport.module.scss";
import { ToastContainer, toast } from "react-toastify";

const StockReport = ({ setLoggedIn }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
    getStockLoad();
  };

  const getStockLoad = async () => {
    setLoading(true);

    try {
      const body = {
        fromDate: fromDate,
        toDate: toDate,
      };

      const res = await axios.post(
        "http://3.141.203.3:5025/api/StockLoad/GetStockLoadsList",
        body
      );
      res.data.forEach((item) => {
        item.fromDate = fromDate;
        item.toDate = toDate;
      });

      setData(res.data);
      setDataExists(true);
      setServerError(false);
      setLoading(false);
    } catch (err) {
      console.log("Api/Server Error while getting stocks data ", err);
      setServerError(true);
      setDataExists("Something went wrong");
      setLoading(false);
    }
  };
  const exportedTableHeaders = [
    { label: "From", key: "fromDate" },
    { label: "To", key: "toDate" },
    { label: "Brand", key: "brand" },
    { label: "Opening", key: "opening" },
    { label: "Load Stock", key: "loadStock" },
    { label: "Sale", key: "sale" },
    { label: "Balance", key: "balance" },
  ];

  return (
    <div className={classes.wrapperr}>
      <Header text="Stock Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>Stock Report</p>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  min="2021-12-01"
                  max={today}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  min="2021-12-01"
                  max={today}
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
                  {data.map((item) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{fromDate}</td>
                        <td>{toDate}</td>
                        <td>{item.brand}</td>
                        <td>{item.opening}</td>
                        <td>{item.loadStock}</td>
                        <td>{item.sale}</td>
                        <td>{item.balance}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
            <CSVLink
              data={data}
              headers={exportedTableHeaders}
              filename={"StockReport.csv"}
              className={`${classes.downloadBtn}`}
            >
              Download Data
            </CSVLink>
          )}
        </Container>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      ;{/* Same as */}
      <ToastContainer />;
    </div>
  );
};
export default StockReport;
