import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
// import classes from "./CustomerFeedbackReport.module.scss";

const CustomerFeedbackReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
    getFeedbacks();
  };

  const getFeedbacks = async () => {
    setLoading(true);
    const body = {
      fromDate: fromDate,
      toDate: toDate,
      user: selectedUser == "allusers" ? null : selectedUser,
    };

    try {
      const response = await axios.post(
        "http://3.141.203.3:8010/api/FeedBack/GetFeedBackReport",
        body
      );

      const data = response.data.data;

      data.forEach((item) => {
        item.date = item.createdDate.split("T")[0];
        item.time = item.createdDate.split("T")[1].split(".")[0];
        item.userId = item?.email?.split("@")[0];
        delete item.createdBy;
        delete item.updatedBy;
        delete item.updatedDate;
        delete item.fireStoreId;
        delete item.id;
        delete item.downloadImageUrl;
      });

      setFeedbacks(data);
      setLoading(false);
      setDataExists(true);
      setServerError(false);
    } catch (err) {
      console.log("Api/Server Error while getting Feeback data ", err);
      setServerError(true);
      setDataExists("Something went wrong");
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
    { label: "Time", key: "time" },
    { label: "User ID", key: "userId" },
    { label: "Image", key: "previewImageUrl" },
  ];

  const showModal = (image) => {
    setIsModalOpen(true);
    let picture =
      "https://drive.google.com/uc?export=view&id=" +
      image.slice(32).split("/")[0];
    setUserImage(picture);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={classes.wrapperr}>
      <Header text="Customer Feedback Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>Customer Feedback Report</p>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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
              >
                <option value="" disabled>
                  Select User
                </option>
                <option value="allusers">All Users</option>
                {users.map((user) =>
                  user.email == null ? null : (
                    <option key={user.id} value={user.id}>
                      {user?.email?.split("@")[0]}
                    </option>
                  )
                )}
              </Form.Select>
              <Form.Group className="mb-3"></Form.Group>
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
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((data) =>
                    data.userId == null ? null : (
                      <tr key={uuidv4()}>
                        <td>{data.date}</td>
                        <td>{data.time}</td>
                        <td>{data?.userId}</td>
                        <td>
                          {/* prettier-ignore */}
                          <a href="/" onClick={(event) => { event.preventDefault(); showModal(data.previewImageUrl); }}>
                            <img src={ "https://drive.google.com/uc?export=view&id=" + data.previewImageUrl.slice(32).split("/")[0] } alt="user attendance" className={classes.userImage} />
                          </a>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
            <CSVLink
              data={feedbacks.filter((item) => item.userId != null)}
              filename={"CustomerFeedbacks.csv"}
              headers={exportedTableHeaders}
              className={`${classes.downloadBtn}`}
            >
              Download Data
            </CSVLink>
          )}
        </Container>
      </Card>
      {isModalOpen && (
        <div className={`${classes.modall}`}>
          <img
            className={classes.userImageModal}
            src={userImage}
            alt="user foto"
          />
          <span
            className={`${classes.closeModal}  ${classes.textWhite}`}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            X
          </span>
        </div>
      )}
      {isModalOpen && (
        <div
          className={`${classes.overlayy}`}
          onClick={() => {
            setIsModalOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default CustomerFeedbackReport;
