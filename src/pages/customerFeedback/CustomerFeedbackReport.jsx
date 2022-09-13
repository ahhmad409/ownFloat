import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// prettier-ignore
import { Row, Col, Card, Button, Form, Container, Modal } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
// import classes from "./CustomerFeedbackReport.module.scss";

const CustomerFeedbackReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [userImage, setUserImage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={userImage} style={{ width: "100%" }} alt="No image" />
        </Modal.Body>
      </Modal>
    );
  };

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
    getFeedbacks();
  };

  const getFeedbacks = async () => {
    setLoading(true);
    const body = {
      fromDate: fromDate.split("-").reverse().join("-"),
      toDate: toDate.split("-").reverse().join("-"),
      user: selectedUser == "allusers" ? null : selectedUser,
    };

    try {
      const response = await axios.post(
        "http://3.141.203.3:5025/api/FeedBack/GetFeedBackReport",
        body
      );

      const data = response.data.data;

      data?.forEach((item) => {
        item.date = item.createdDate.split("T")[0];
        item.time = item.createdDate.split("T")[1].split(".")[0];
        item.userId = item?.email?.split("@")[0] || "Unknown";
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
        "http://3.141.203.3:5025/api/Authentication/fetchallusers"
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
    let picture = image.includes("drive.google.com")
      ? "https://drive.google.com/uc?export=view&id=" +
        image.slice(32).split("/")[0]
      : image;
    setUserImage(picture);
    setModalShow(true);
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
                  {feedbacks.map((data) => (
                    <tr key={uuidv4()}>
                      <td>{data.date}</td>
                      <td>{data.time}</td>
                      <td>{data?.userId}</td>
                      {/* prettier-ignore */}
                      <td>
                      <a  onClick={() => showModal(data.previewImageUrl)}>  <img src={ data.previewImageUrl.includes("drive.google.com") ?  "  https://drive.google.com/uc?export=view&id=" + data.previewImageUrl.slice(32).split("/")[0] : data.previewImageUrl }  className={classes.userImage}  /> </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default CustomerFeedbackReport;
