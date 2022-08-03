import React, { useEffect, useState } from "react";
import fire from "../../helpers/fire";
import classes from "./StockReport.module.scss";
import { v4 as uuidv4 } from "uuid";
import { CSVLink, CSVDownload } from "react-csv";

//prettier-ignore
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";
import mapIcon from "../mapIcon.png";
import Button from "../../components/CustomButton/CustomButton";

const StockReport = () => {
  // const [stockLoad, setStockLoad] = useState([]);
  // const [consumerData, setConsumerData] = useState([]);
  // const [data, setData] = useState([]);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  // const [loadingStock, setLoadingStock] = useState(false);
  // const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");
  // const [exportData, setExportData] = useState([]);

  // // prettier-ignore
  // let classic = { prevStock: 0, loadStock: 0, sale: 0, prevSale: 0, brand: "Classic", };
  // let GSI = { prevStock: 0, loadStock: 0, sale: 0, prevSale: 0, brand: "GSI" };

  // const refStockLoad = fire.firestore().collection("StockLoad").get();
  // const refConsumerDataForm = fire
  //   .firestore()
  //   .collection("ConsumerDataForm")
  //   .get();

  // const searchHandler = async () => {
  //   if (!datesValidation()) return;

  //   setLoadingStock(true);
  //   let [fromDate, toDate] = datesValidation();

  //   stockLoad.map((item) => {
  //     let itemDate = item.date.replace(/-/g, "/");

  //     if (item.brand == "Classic") {
  //       if (itemDate >= fromDate && itemDate <= toDate) {
  //         classic = {
  //           ...classic,
  //           loadStock: classic.loadStock + Number(item.stockLoad),
  //         };
  //       } else if (itemDate < fromDate) {
  //         classic = {
  //           ...classic,
  //           prevStock: classic.prevStock + Number(item.stockLoad),
  //         };
  //       }
  //     } else if (item.brand == "GSI") {
  //       if (itemDate >= fromDate && itemDate <= toDate) {
  //         GSI = {
  //           ...GSI,
  //           loadStock: GSI.loadStock + Number(item.stockLoad),
  //         };
  //       } else if (itemDate < fromDate) {
  //         GSI = {
  //           ...GSI,
  //           prevStock: GSI.prevStock + Number(item.stockLoad),
  //         };
  //       }
  //     }
  //   });

  //   consumerData.map((item) => {
  //     let itemDate = item.date.replace(/-/g, "/");

  //     if (item.callStatus == "Productive") {
  //       if (item.currentBrand == "Classic") {
  //         if (itemDate >= fromDate && itemDate <= toDate) {
  //           classic = {
  //             ...classic,
  //             sale: classic.sale + 1,
  //           };
  //         } else if (itemDate < fromDate) {
  //           classic = {
  //             ...classic,
  //             prevSale: classic.prevSale + 1,
  //           };
  //         }
  //       } else if (item.currentBrand == "GSI") {
  //         if (itemDate >= fromDate && itemDate <= toDate) {
  //           GSI = {
  //             ...GSI,
  //             sale: GSI.sale + 1,
  //           };
  //         } else if (itemDate < fromDate) {
  //           GSI = {
  //             ...GSI,
  //             prevSale: GSI.prevSale + 1,
  //           };
  //         }
  //       }
  //     }
  //   });

  //   setData([classic, GSI]);

  //   setExportData([
  //     {
  //       from: fromDate,
  //       to: toDate,
  //       brand: classic.brand,
  //       opening: classic.prevStock - classic.prevSale,
  //       loadStock: classic.loadStock,
  //       sale: classic.sale,
  //       balance:
  //         classic.prevStock +
  //         classic.loadStock -
  //         (classic.prevSale + classic.sale),
  //     },
  //     {
  //       from: fromDate,
  //       to: toDate,
  //       brand: GSI.brand,
  //       opening: GSI.prevStock - GSI.prevSale,
  //       loadStock: GSI.loadStock,
  //       sale: GSI.sale,
  //       balance: GSI.prevStock + GSI.loadStock - (GSI.prevSale + GSI.sale),
  //     },
  //   ]);

  //   setLoadingStock(false);
  // };

  // const getStockLoad = () => {
  //   const fetchedStockLoad = [];
  //   refStockLoad.then((res) => {
  //     res.forEach((document) => {
  //       fetchedStockLoad.push(document.data());
  //     });
  //     setStockLoad(fetchedStockLoad);
  //   });
  // };

  // const getConsumerData = () => {
  //   const fetchedConsumerData = [];
  //   refConsumerDataForm.then((res) => {
  //     res.forEach((document) => {
  //       fetchedConsumerData.push(document.data());
  //     });
  //     setConsumerData(fetchedConsumerData);
  //   });
  // };

  // const datesValidation = () => {
  //   let selectedfromDate = fromDate.replace(/-/g, "/");
  //   let selectedtoDate = toDate.replace(/-/g, "/");

  //   if (selectedfromDate > currentDate || selectedtoDate > currentDate) {
  //     alert("Invalid Dates Selection (future date detected) ");
  //     return false;
  //   }

  //   if (selectedtoDate < selectedfromDate) {
  //     alert("End date must be equal or greater than start date");
  //     return false;
  //   }

  //   return [selectedfromDate, selectedtoDate];
  // };

  // useEffect(() => {
  //   getConsumerData();
  //   getStockLoad();
  // }, []);

  return (
    <div className="content">
      {/* <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Stock Report"
              content={
                <form>
                  <div className="row">
                    <div className="col-md-6 col-lg-4 ">
                      <FormGroup controlId="formBasicText">
                        <ControlLabel>From</ControlLabel>
                        <FormControl
                          type="date"
                          value={fromDate}
                          onChange={(event) => {
                            setFromDate(event.target.value);
                          }}
                          placeholder="Enter date"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <FormGroup controlId="formBasicText">
                        <ControlLabel>To</ControlLabel>
                        <FormControl
                          type="date"
                          value={toDate}
                          onChange={(event) => {
                            setToDate(event.target.value);
                          }}
                          placeholder="Enter date"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <Button
                        bsStyle="warning"
                        pullRight
                        fill
                        disabled={!fromDate || !toDate}
                        onClick={searchHandler}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  {loadingStock ? (
                    <p className={classes.para}>Loading...</p>
                  ) : data.length > 0 ? (
                    <Row>
                      <div
                        className={`table-responsive ${classes.tableResponsive}`}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Brand</th>
                              <th>Opening</th>
                              <th>Load Stock</th>
                              <th>Sale</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.length > 0
                              ? data.map((dataa) => (
                                  <tr key={uuidv4()}>
                                    <td>{fromDate}</td>
                                    <td>{toDate}</td>
                                    <td>{dataa.brand}</td>
                                    <td>{dataa.prevStock - dataa.prevSale}</td>
                                    <td>{dataa.loadStock}</td>
                                    <td>{dataa.sale}</td>
                                    <td>
                                      {dataa.prevStock +
                                        dataa.loadStock -
                                        (dataa.prevSale + dataa.sale)}
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </table>
                      </div>
                      <CSVLink
                        data={exportData}
                        filename={"StockReport.csv"}
                        className={`${classes.downloadBtn}`}
                      >
                        Download Data
                      </CSVLink>
                    </Row>
                  ) : (
                    <p className={classes.para}>No Data</p>
                  )}
                  <div className="clearfix" />
                </form>
              }
            />
          </Col>
        </Row>
      </Grid> */}
      Stock Report JSX
    </div>
  );
};

export default StockReport;
