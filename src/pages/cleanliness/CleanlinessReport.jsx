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
// import classes from "./CleanlinessReport.module.scss";

const CleanlinessReport = ({ setLoggedIn }) => {
  const [floats, setFloats] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedFloat, setSelectedFloat] = useState("");
  const [cleanlinessData, setcleanlinessData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState("");

  const searchHandler = () => {
    if (!datesValidation()) return;
    getFloats();
  };

  const getFloats = async () => {
    setLoading(true);

    const body = {
      floatId: selectedFloat == "allfloats" ? null : selectedFloat,
      fromDate: fromDate.split("-").reverse().join("/"),
      toDate: toDate.split("-").reverse().join("/"),
    };

    try {
      const response = await axios.post(
        "http://3.141.203.3:8010/api/CleanlinessFileUpload/GetCleanlinessReport",
        body
      );

      setFloats(response.data.data);
      setDataExists(true);
      setServerError(false);
      setLoading(false);
    } catch (err) {
      console.log("Api/Server Error while getting floats data ", err);
      setServerError(true);
      setLoading(false);
    }
  };

  const exportedTableHeaders = [
    { label: "Date", key: "data.time" },
    { label: "Image", key: "data.territoryName" },
    { label: "Status", key: "data.town" },
    { label: "Float Name", key: "data.userId" },
  ];

  const datesValidation = () => {
    let selectedfromDate = fromDate.replace(/-/g, "/");
    let selectedtoDate = toDate.replace(/-/g, "/");
    const currentDate = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");

    if (selectedfromDate > currentDate || selectedtoDate > currentDate) {
      alert("Invalid Dates Selection (future date detected) ");
      return false;
    }

    if (selectedtoDate < selectedfromDate) {
      alert("End date must be equal or greater than start date");
      return false;
    }

    return [selectedfromDate, selectedtoDate];
  };

  const showModal = (image) => {
    setIsModalOpen(true);
    let picture =
      "https://drive.google.com/uc?export=view&id=" +
      image.slice(32).split("/")[0];
    setUserImage(picture);
  };

  const handleLogout = () => {
    localStorage.removeItem("ali123@gmail.com");
    setLoggedIn(false);
  };

  return (
    <div className={classes.wrapperr}>
      <div className={classes.topBar}>
        <p className={classes.fileHeading}>Cleanliness Report </p>
        <p onClick={handleLogout}>Logout</p>
      </div>
      <Card className={classes.cardd}>
        <p className={`${classes.fileHeading} ${classes.fileHeadingg}`}>
          Cleanliness Report
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
              <Form.Label>Select Float</Form.Label>
              <Form.Select
                defaultValue={""}
                onChange={(e) => {
                  setSelectedFloat(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="" disabled>
                  Select Float
                </option>
                <option value="allfloats">All Floats</option>
                {floats.map((float) => (
                  <option key={uuidv4()} value={float.floatId}>
                    {float.userName || "floatName"}
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
                disabled={!fromDate || !toDate || !selectedFloat}
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
                    <th>Date</th>
                    <th>Image</th>
                    <th>Status </th>
                    <th>Float Name</th>
                  </tr>
                </thead>
                <tbody>
                  {floats.map((float) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{float.date || "Date"}</td>
                        <td>
                          {float.previewImageUrl.map((image) => (
                            <a
                              key={uuidv4()}
                              href="/"
                              onClick={(event) => {
                                event.preventDefault();
                                showModal(image);
                              }}
                            >
                              <img
                                src={
                                  "https://drive.google.com/uc?export=view&id=" +
                                  image.slice(32).split("/")[0]
                                }
                                alt="user attendance"
                                className={classes.userImage}
                              />
                            </a>
                          ))}
                        </td>
                        <td>{float.status || "Status"}</td>
                        <td>{float.floatId || "Float Name"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && (
            <CSVLink
              data={cleanlinessData}
              filename={"CleanlinessReport.csv"}
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

export default CleanlinessReport;
