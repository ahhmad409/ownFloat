import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import Header from "../../components/Header/Header";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import { datesValidation } from "../datesValidation";
import { userbrands } from "../data";
import { Floats } from "../data";
// import classes from "./CleanlinessReport.module.scss";

const CleanlinessReport = ({ setLoggedIn }) => {
  const [floats, setFloats] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedFloat, setSelectedFloat] = useState("");
  const [cleanlinessData, setCleanlinessData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState("");

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
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

      const data = response.data.data;

      data.forEach((item) => {
        Floats.forEach((float) => {
          if (float.id == item.floatId) {
            item.floatName = float.name;
            item.userName = float?.email?.split("@")[0];
          }
        });
      });

      setFloats(data);
      setCleanlinessData(data);
      setDataExists(true);
      setServerError(false);
      setLoading(false);
    } catch (err) {
      console.log("Api/Server Error while getting floats data ", err);
      setServerError(true);
      setDataExists("Something went wrong");
      setLoading(false);
    }
  };

  const exportedTableHeaders = [
    { label: "User ID", key: "userId" },
    { label: "Date", key: "date" },
    { label: "Status", key: "status" },
    { label: "Float Name", key: "floatName" },
    { label: "Image", key: "previewImageUrl" },
  ];

  const showModal = (image) => {
    setIsModalOpen(true);
    let picture =
      "https://drive.google.com/uc?export=view&id=" +
      image.slice(32).split("/")[0];
    setUserImage(picture);
  };

  return (
    <div className={classes.wrapperr}>
      <Header text="Cleanliness Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>Cleanliness Report</p>
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
              <Form.Label>Select Float</Form.Label>
              <Form.Select
                defaultValue={""}
                onChange={(e) => {
                  setSelectedFloat(e.target.value);
                }}
              >
                <option value="" disabled>
                  Select Float
                </option>
                <option value="allfloats">All Floats</option>
                {Floats.map((float) => (
                  <option key={float.id} value={float.id}>
                    {float.name || "floatName"}
                  </option>
                ))}
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
                    <th>User ID</th>
                    <th>Float Name</th>
                    <th>Date</th>
                    <th>Image</th>
                    <th>Status </th>
                  </tr>
                </thead>
                <tbody>
                  {floats.map((float) => {
                    return float.userName == null ? null : (
                      <tr key={uuidv4()}>
                        <td>{float.userName}</td>
                        <td>{float.floatName}</td>
                        <td>{float.date}</td>
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
                        <td>{float.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
            <CSVLink
              data={cleanlinessData.filter((item) => item.userName != null)}
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
