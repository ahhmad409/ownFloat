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
// import classes from "./UserInterceptionReport.module.scss";

const UserInterceptionReport = ({ setLoggedIn }) => {
  const [modalShow, setModalShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [consumerData, setConsumerData] = useState([]);
  const [userImage, setUserImage] = useState("");

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
    getConsumerData();
  };

  const getConsumerData = () => {
    setLoading(true);

    const body = {
      brandName: null,
      userId: selectedUser == "allusers" ? null : selectedUser,
      dateFrom: fromDate,
      dateTo: toDate,
    };

    // prettier-ignore
    axios.post("http://3.141.203.3:5025/api/ConsumerDataForm/Get",body).then((res)=>{
      const data = res.data.data;
      console.log("ayy aya data  =>>>>>.   ",  data);

      users.forEach((user)=>{
        data.forEach((item)=>{
          if(user.id == item.userID){
            item.userName = user?.email?.split("@")[0] || "Unknown";
            item.date = item.date.split("T")[0];
            item.time = item.createdAt.split("T")[1].split(".")[0];
            let phonee = item.cellNo.split("+92")[1]; // 331-7354962
            item.phone= "92-" + phonee;
            delete item.userID; delete item.id;
            delete item.fireStoreId;
          }
          // if(item.userName == null){
          //   item = null;
          // }
        })
      })

      setConsumerData(data);
      setDataExists(true);
      setServerError(false);
      setLoading(false);
    }).catch((err)=>{
      console.log("Api/Server Error while getting consumer data ", err);
      setServerError(true);
      setDataExists("Something went wrong");
      setLoading(false);
    })
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://3.141.203.3:5025/api/authentication/FetchAllUsers"
      );
      setUsers(response.data.data);
    } catch (err) {
      console.log("Api/Server Error while getting users ", err);
    }
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
    { label: "Image", key: "previewImageUrl" },
    { label: "Latitude", key: "lat" },
    { label: "Longitude", key: "lng" },
  ];

  const showModal = (image) => {
    console.log("ayyy ai image=========>>>    ", image);
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
      <Header text="User Interception Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>User Interception Report</p>
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
                    <th>Image</th>
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
                      <td>
                        {/* prettier-ignore */}
                        <a  onClick={() => showModal(data?.previewImageUrl)}>  <img src={ data?.previewImageUrl?.includes("drive.google.com") ?  "  https://drive.google.com/uc?export=view&id=" + data?.previewImageUrl.slice(32).split("/")[0] : data.previewImageUrl }  className={classes.userImage} /> </a>
                      </td>
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
          {dataExists && !loading && !serverError && (
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

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default UserInterceptionReport;
