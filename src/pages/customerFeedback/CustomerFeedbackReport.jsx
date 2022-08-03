import React, { useState, useEffect } from "react";
import classes from "./CustomerFeedbackReport.scss";
import { v4 as uuidv4 } from "uuid";
import { CSVLink, CSVDownload } from "react-csv";

//prettier-ignore
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import fire from "../../helpers/fire";
import Card from "../../components/Card/Card.jsx";
import mapIcon from "../mapIcon.png";
import Button from "../../components/CustomButton/CustomButton";

const CustomerFeedbackReport = () => {
  // const [users, setUsers] = useState([]);
  // const [fetchingUsers, setFetchingUsers] = useState(false);
  // const [consumerData, setConsumerData] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(""); //selectedUser is a userID and not a user itself
  // const [loadingReport, setLoadingReport] = useState(false);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  // const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

  // const refUsers = fire.firestore().collection("user");
  // const refConsumerDataForm = fire
  //   .firestore()
  //   .collection("ConsumerDataForm")
  //   .where("userID", "==", selectedUser)
  //   .get();

  // const refConsumerDataFormAllUsers = fire
  //   .firestore()
  //   .collection("ConsumerDataForm")
  //   .get();

  // const searchHandler = () => {
  //   if (!datesValidation()) return;

  //   getConsumerData();
  // };

  // const getConsumerData = () => {
  //   setLoadingReport(true);

  //   if (selectedUser === "allusers") {
  //     const fetchedConsumerData = [];

  //     refConsumerDataFormAllUsers.then((res) => {
  //       res.forEach((document) => {
  //         fetchedConsumerData.push(document.data());
  //       });

  //       let [fromDate, toDate] = datesValidation();
  //       setConsumerData(
  //         fetchedConsumerData.filter((data) => {
  //           const dataDate = data.date.replace(/-/g, "/");
  //           data.time = data.createdAt
  //             ?.toDate()
  //             .toString()
  //             .slice(16)
  //             .split(" ")[0];

  //           if (dataDate >= fromDate && dataDate <= toDate) {
  //             delete data.createdAt;
  //             let phone = data.cellNo.split("+92")[1]; // 331-7354962
  //             data.cellNo = "92-" + phone;
  //             return data;
  //           }
  //         })
  //       );
  //       setLoadingReport(false);
  //     });
  //   } else {
  //     const fetchedConsumerData = [];
  //     refConsumerDataForm.then((res) => {
  //       res.forEach((document) => {
  //         fetchedConsumerData.push(document.data());
  //       });

  //       let [fromDate, toDate] = datesValidation();
  //       setConsumerData(
  //         fetchedConsumerData.filter((data) => {
  //           const dataDate = data.date.replace(/-/g, "/");
  //           data.time = data.createdAt
  //             ?.toDate()
  //             .toString()
  //             .slice(16)
  //             .split(" ")[0];
  //           if (dataDate >= fromDate && dataDate <= toDate) {
  //             delete data.createdAt;
  //             let phone = data.cellNo.split("+92")[1];
  //             data.cellNo = "92-" + phone;
  //             return data;
  //           }
  //         })
  //       );
  //       setLoadingReport(false);
  //     });
  //   }
  // };

  // const getUsersHanlder = () => {
  //   setFetchingUsers(true);
  //   refUsers.onSnapshot((querySnapshot) => {
  //     const fetchedUsers = [];
  //     querySnapshot.forEach((document) => {
  //       fetchedUsers.push(document.data());
  //     });
  //     setUsers(fetchedUsers);
  //     setFetchingUsers(false);
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

  // const goToMap = () => {};

  // useEffect(() => {
  //   getUsersHanlder();
  // }, []);

  return (
    <div className="content">
      {/* <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Customer Feedback Report"
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
                    <div className="col-md-6 col-lg-4">
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select User</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          className="form-controll"
                          defaultValue={""}
                          onChange={(event) => {
                            setSelectedUser(event.target.value);
                          }}
                        >
                          <option value="" disabled>
                            select
                          </option>
                          <option value="allusers">All Users</option>
                          {fetchingUsers ? (
                            <option>Fetching....</option>
                          ) : (
                            users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))
                          )}
                        </FormControl>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <Button
                        disabled={!selectedUser || !fromDate || !toDate}
                        bsStyle="warning"
                        pullRight
                        fill
                        onClick={searchHandler}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  <Row>
                    {loadingReport ? (
                      <p className={classes.para}> Loading Data.... </p>
                    ) : consumerData.length > 0 ? (
                      <div>
                        <div
                          className={`table-responsive ${classes.tableResponsive}`}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>date</th>
                                <th>time</th>
                                <th>territory Name</th>
                                <th>town</th>
                                <th>user id</th>
                                <th>name</th>
                                <th>CNIC</th>
                                <th>cell No</th>
                                <th>age</th>
                                <th>address</th>
                                <th>current Brand</th>
                                <th>target Brand</th>
                                <th>call Status</th>
                                <th>prize Given</th>
                                <th>Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              {consumerData.map((data) => (
                                <tr key={uuidv4()}>
                                  <td>{data.date}</td>
                                  <td>{data.time}</td>
                                  <td>{data.territoryName}</td>
                                  <td>{data.town}</td>
                                  <td>{data.userID}</td>
                                  <td>{data.name}</td>
                                  <td>{data.CNIC}</td>
                                  <td>{data.cellNo}</td>
                                  <td>{data.age}</td>
                                  <td>{data.address}</td>
                                  <td>{data.currentBrand}</td>
                                  <td>{data.targetBrand}</td>
                                  <td>{data.callStatus}</td>
                                  <td>{data.prizeGiven}</td>
                                  <td style={{ position: "relative" }}>
                                    <a
                                      href={`http://maps.google.com/maps?q=loc:${data.lat},${data.lng}`}
                                      target="_blank"
                                    >
                                      <img
                                        src={mapIcon}
                                        style={{
                                          height: "45px",
                                          width: "55px",
                                          position: "absolute",
                                          top: "0px",
                                          left: "20px",
                                        }}
                                      />
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <CSVLink
                          data={consumerData}
                          filename={"ConsumerData.csv"}
                          className={`${classes.downloadBtn}`}
                        >
                          Download Data
                        </CSVLink>
                      </div>
                    ) : (
                      <p className={classes.para}>No Data</p>
                    )}
                  </Row>
                  <div className="clearfix" />
                </form>
              }
            />
          </Col>
        </Row>
      </Grid> */}
      Customer Feedback Report
    </div>
  );
};

export default CustomerFeedbackReport;
