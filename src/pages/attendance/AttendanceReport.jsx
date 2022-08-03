import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import classes from "./AttendanceReport.module.scss";
import { CSVLink, CSVDownload } from "react-csv";
//prettier-ignore
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import fire from "../../helpers/fire";
import Card from "../../components/Card/Card.jsx";
import mapIcon from "../mapIcon.png";
import Button from "../../components/CustomButton/CustomButton";

const AttendanceReport = () => {
  // const [userImage, setUserImage] = useState("");
  // const [users, setUsers] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [userName, setUserName] = useState("");
  // const [selectedUser, setSelectedUser] = useState(""); //selectedUser is a userID and not a user itself
  // const [fetchingUsers, setFetchingUsers] = useState(false);
  // const [attendances, setAttendances] = useState([]);
  // const [data, setData] = useState([]);
  // const [loadingAttendances, setLoadingAttendances] = useState(false);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  // const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

  // //firebase references
  // const refAttendance = fire.firestore().collection("Attendance");
  // const refUsers = fire.firestore().collection("user");

  // const searchHandler = () => {
  //   if (!datesValidation()) return;

  //   getAttendances();
  // };

  // const showModal = (image) => {
  //   setIsModalOpen(true);
  //   let picture =
  //     "https://drive.google.com/uc?export=view&id=" +
  //     image.slice(32).split("/")[0];
  //   setUserImage(picture);
  // };

  // const getAttendances = async () => {
  //   setLoadingAttendances(true);

  //   if (selectedUser === "allusers") {
  //     const tempAttendances = [];
  //     const snapshot = await refAttendance.get();
  //     snapshot.docs.map((doc) => tempAttendances.push(doc.data()));
  //     let [fromDate, toDate] = datesValidation();
  //     setAttendances(
  //       tempAttendances.filter((attendance) => {
  //         const attendanceDate = attendance.date.replace(/-/g, "/");
  //         if (attendanceDate >= fromDate && attendanceDate <= toDate) {
  //           attendance.time = attendance.CreatedDate?.toDate()
  //             .toString()
  //             .slice(16)
  //             .split(" ")[0];
  //           users.forEach((user) => {
  //             if (user.id == attendance.id) {
  //               attendance.user = user.name;
  //             }
  //           });

  //           delete attendance.id;
  //           delete attendance.CreatedDate;
  //           return attendance;
  //         }
  //       })
  //     );
  //     setLoadingAttendances(false);
  //   } else {
  //     const attend = [];
  //     refAttendance
  //       .where("id", "==", selectedUser)
  //       .get()
  //       .then((res) => {
  //         res.docs.map((a) => {
  //           attend.push(a.data());
  //         });

  //         let [fromDate, toDate] = datesValidation();
  //         setAttendances(
  //           attend.filter((attendance) => {
  //             const attendanceDate = attendance.date.replace(/-/g, "/");
  //             if (attendanceDate >= fromDate && attendanceDate <= toDate) {
  //               attendance.time = attendance.CreatedDate?.toDate()
  //                 .toString()
  //                 .slice(16)
  //                 .split(" ")[0];
  //               attendance.user = userName.name;
  //               delete attendance?.id;
  //               delete attendance.CreatedDate;
  //               return attendance;
  //             }
  //           })
  //         );

  //         setLoadingAttendances(false);
  //       });
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

  // useEffect(() => {
  //   getUsersHanlder();
  // }, []);

  return (
    <div className="content">
      {/* <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Attendance Report"
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
                            users.map((user) => {
                              if (user.id == event.target.value) {
                                setUserName(user);
                              }
                            });
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
                  {loadingAttendances ? (
                    <p className={classes.para}>Loading...</p>
                  ) : attendances.length > 0 ? (
                    <Row>
                      <div
                        className={`table-responsive ${classes.tableResponsive}`}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>date</th>
                              <th>time</th>
                              <th>user</th>
                              <th>image</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendances.map((data) => (
                              <tr key={uuidv4()}>
                                <td>{data.date}</td>
                                <td>{data.time}</td>
                                <td>{data.user || "userrr"}</td>
                                <td>
                                  <a
                                    href="/"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      showModal(data.PreviewImageUrl);
                                    }}
                                  >
                                    <img
                                      src={
                                        "https://drive.google.com/uc?export=view&id=" +
                                        data.PreviewImageUrl.slice(32).split(
                                          "/"
                                        )[0]
                                      }
                                      alt="user attendance"
                                      className={classes.userImage}
                                    />
                                  </a>
                                </td>
                                <td style={{ position: "relative" }}>
                                  <a
                                    href={`http://maps.google.com/maps?q=loc:${data.latitude},${data.longitude}`}
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
                        data={attendances}
                        filename={"AttendancesReport.csv"}
                        className={classes.downloadBtn}
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
      </Grid>
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
      )} */}
      Attendance Report
    </div>
  );
};

export default AttendanceReport;
