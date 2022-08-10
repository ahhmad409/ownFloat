import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import mapIcon from "./mapIcon.png";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
import { usersFirebase } from "../data";
// import classes from "./AttendanceReport.module.scss";

const AttendanceReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); //selectedUser is a userID and not a user itself
  const [attendances, setAttendances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState("");

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
      .post("http://3.141.203.3:8010/api/attendence/GetAttendenceReport", body)
      .then((res) => {
        const data = res.data.data;

        users.forEach((user) => {
          data.forEach((item) => {
            if (user.fireStoreId == item.fireStoreId) {
              item.userName = user?.email?.split("@")[0];
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
        "http://3.141.203.3:8010/api/Authentication/fetchallusers"
      );
      setUsers(response.data.data);
    } catch (err) {
      console.log("Api/Server error while getting users  ", err);
    }
  };

  const exportedTableHeaders = [
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "User ID", key: "userName" },
    { label: "Image", key: "previewImageUrl" },
    { label: "Longitude", key: "longitude" },
    { label: "Latitude", key: "latitude" },
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
                    <th>image</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((data) => {
                    return data.userName == null ? null : (
                      <tr key={uuidv4()}>
                        <td>{data.date}</td>
                        <td>{data.time}</td>
                        <td>{data.userName}</td>
                        <td>
                          {/* prettier-ignore */}
                          <a href="/" onClick={(event) => { event.preventDefault(); showModal(data.previewImageUrl); }}>
                            <img src={ "https://drive.google.com/uc?export=view&id=" + data.previewImageUrl.slice(32).split("/")[0] } alt="user attendance" className={classes.userImage} />
                          </a>
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
              data={attendances.filter((item) => item.userName != null)}
              filename={"AttendanceReport.csv"}
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

export default AttendanceReport;
