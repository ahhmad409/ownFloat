import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Container,
  Modal,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import mapIcon from "./mapIcon.png";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
import { usersFirebase } from "../data";
// import classes from "./AttendanceReport.module.scss";
import { ToastContainer, toast } from "react-toastify";

const AttendanceReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); //selectedUser is a userID and not a user itself
  const [attendances, setAttendances] = useState([]);
  const [userImage, setUserImage] = useState("");
  const today = new Date().toISOString().split("T")[0];

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
    getAttendances();
  };

  const getAttendances = () => {
    setLoading(true);

    const body = {
      fromDate: fromDate,
      toDate: toDate,
      user: selectedUser == "allusers" ? null : selectedUser,
    };

    axios
      .post("http://3.141.203.3:5025/api/attendence/GetAttendenceReport", body)
      .then((res) => {
        const data = res.data.data;

        users.forEach((user) => {
          data.forEach((item) => {
            if (user.fireStoreId == item.fireStoreId) {
              item.userId = user?.email?.split("@")[0] || "Unknown";
              item.userId = item.userId.includes("CI")
                ? item.userId.slice(2)
                : item.userId.slice(4);

              item.floatName = item.userName.includes("CI")
                ? "CI"
                : item.userName.includes("2")
                ? "GSI 2"
                : "GSI 1" || "Unknown";
              item.date = item.date.split("T")[0];
              item.time = item.createdDate.split("T")[1].split(".")[0];
              delete item.fireStoreId;
              delete item.createdDate;
              delete item.createdBy;
              delete item.updatedBy;
              delete item.updatedDate;
              delete item.fireStoreId;
            }
          });
        });

        setAttendances(data);
        setDataExists(true);
        setServerError(false);
        setLoading(false);
      })
      .catch((err) => {
        setServerError(true);
        setDataExists("Something went wrong");
        console.log("Api/Server Error while getting attendances ", err);
        setLoading(false);
      });
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://3.141.203.3:5025/api/Authentication/fetchallusers"
      );
      setUsers(response.data.data);
    } catch (err) {
      console.log("Api/Server error while getting users  ", err);
    }
  };

  const exportedTableHeaders = [
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "User ID", key: "userId" },
    { label: "Float Name", key: "floatName" },
    { label: "Image", key: "previewImageUrl" },
    { label: "Longitude", key: "longitude" },
    { label: "Latitude", key: "latitude" },
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
      <Header text="Attendance Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>Attendance Report</p>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  min="2021-12-01"
                  max={today}
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
                  min="2021-12-01"
                  max={today}
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
                    <th>float name</th>
                    <th>image</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((data) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{data.date}</td>
                        <td>{data.time}</td>
                        <td>{data.userId}</td>
                        <td>{data.floatName}</td>
                        <td>
                          {/* prettier-ignore */}
                          <a  onClick={() => showModal(data.previewImageUrl)}>  <img src={ data.previewImageUrl.includes("drive.google.com") ?  "  https://drive.google.com/uc?export=view&id=" + data.previewImageUrl.slice(32).split("/")[0] : data.previewImageUrl }  className={classes.userImage} /> </a>
                        </td>
                        <td style={{ position: "relative" }}>
                          {/* prettier-ignore */}
                          <a href={`http://maps.google.com/maps?q=loc:${data.latitude},${data.longitude}`} target="_blank" >
                            {/* prettier-ignore */}
                            <img src={mapIcon}
                              style={{ height: "45px", width: "55px", position: "absolute", top: "0px", left: "20px", }}
                            />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
            <CSVLink
              data={attendances}
              filename={"AttendanceReport.csv"}
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

export default AttendanceReport;
