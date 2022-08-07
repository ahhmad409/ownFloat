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
// import classes from "./CustomerFeedbackReport.module.scss";
import { datesValidation } from "../datesValidation";

const CustomerFeedbackReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
    getFeedbacks();
  };

  const getFeedbacks = async () => {
    setLoading(true);
    const body = {
      fromDate: null,
      toDate: null,
      user: null,
    };

    try {
      const response = await axios.post(
        "http://3.141.203.3:8010/api/FeedBack/GetFeedBackReport",
        body
      );
      setFeedbacks(response.data.data);
      setLoading(false);
      setDataExists(true);
      setServerError(false);
    } catch (err) {
      console.log("Api/Server Error while getting Feeback data ", err);
      setServerError(true);
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://3.141.203.3:8010/api/Authentication/fetchallusers"
      );
      setUsers(response.data.data);
    } catch (err) {
      console.log("Api/Server Error while getting users ", err);
    }
  };

  const exportedTableHeaders = [
    { label: "Date", key: "date" },
    { label: "User ID", key: "userName" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ali123@gmail.com");
    setLoggedIn(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={classes.wrapperr}>
      <div className={classes.topBar}>
        <p className={classes.fileHeading}>Customer Feedback Report </p>
        <p onClick={handleLogout}>Logout</p>
      </div>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          Customer Feedback Report
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
              <Form.Label>Select User</Form.Label>
              <Form.Select
                defaultValue={""}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="" disabled>
                  Select User
                </option>
                <option value="allusers">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user?.email?.split("@")[0] || "loading....."}
                  </option>
                ))}
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
                disabled={!fromDate || !toDate || !selectedUser}
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
                    <th>user id</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((data) => (
                    <tr key={uuidv4()}>
                      <td>{data.createdDate.split("T")[0]}</td>
                      <td>{data.createdDate.split("T")[1].split(".")[0]}</td>
                      <td>{data.userName || "userName"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && (
            <CSVLink
              data={feedbacks}
              filename={"CustomerFeedbacks.csv"}
              headers={exportedTableHeaders}
              className={`${classes.downloadBtn}`}
            >
              Download Data
            </CSVLink>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default CustomerFeedbackReport;
