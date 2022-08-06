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
import mapIcon from "./mapIcon.png";
import { usersFirebase } from "../data";
// import classes from "./UserInterceptionReport.module.scss";

const UserInterceptionReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [consumerData, setConsumerData] = useState([]);

  const searchHandler = () => {
    getConsumerData();
  };

  const getUsers = () => {
    // prettier-ignore
    axios.get("http://3.141.203.3:8010/api/Authentication/fetchallusers").then((res) => {
        setUsers(res.data.data);
      });
  };

  const getConsumerData = () => {
    setLoading(true);
    const postBody = {
      brandName: null,
      userId: selectedUser == "allusers" ? null : selectedUser,
      dateFrom: fromDate,
      dateTo: toDate,
    };

    // prettier-ignore
    axios.post("http://3.141.203.3:8010/api/ConsumerDataForm/Get",postBody).then((res)=>{
      setDataExists(true);
      usersFirebase.forEach((user)=>{
        res.data.data.forEach((resUser)=>{
          if(user.id === resUser.userID){
            resUser.userName = user.name;
            resUser.date = resUser.date.split("T")[0];
            resUser.time = resUser.createdAt.split("T")[1].split(".")[0];
            let phonee = resUser.cellNo.split("+92")[1]; // 331-7354962
            resUser.phone= "92-" + phonee;
            delete resUser.userID;
            delete resUser.id;
            delete resUser.fireStoreId;
            delete resUser.previewImageUrl;
            delete resUser.downloadImageUrl;
          }
        })
      })

      setConsumerData(res.data.data);
      setLoading(false);
    }).catch((err)=>{
      console.log("Error while getting consumer data from server/api  ", err);
      setLoading(false);
    })
  };

  const exportedTableHeaders = [
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Territory Name", key: "territoryName" },
    { label: "Town", key: "town" },
    { label: "User ID", key: "userName" },
    { label: "Name", key: "name" },
    { label: "Cnic", key: "cnic" },
    { label: "Phone Number", key: "phone" },
    { label: "Age", key: "age" },
    { label: "Address", key: "address" },
    { label: "Current Brand", key: "currentBrand" },
    { label: "Target Brand", key: "targetBrand" },
    { label: "Call Status", key: "callStatus" },
    { label: "Prize Given", key: "prizeGiven" },
    { label: "Latitude", key: "lat" },
    { label: "Longitude", key: "lng" },
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
        <p className={classes.fileHeading}>User Interception Report </p>
        <p onClick={handleLogout}>Logout</p>
      </div>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          User Interception Report
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
                    {user.name}
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
                    <th>territory Name</th>
                    <th>town</th>
                    <th>user id</th>
                    <th>name</th>
                    <th>CNIC</th>
                    <th>Phone No</th>
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
                      <td>{data.userName}</td>
                      <td>{data.name}</td>
                      <td>{data.cnic}</td>
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
          )}
          {dataExists && !loading && (
            <CSVLink
              data={consumerData}
              filename={"UserInterceptionReport.csv"}
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

export default UserInterceptionReport;
