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
import Header from "../../components/Header/Header";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import { datesValidation } from "../datesValidation";
import { Floats } from "../data";
import { ToastContainer, toast } from "react-toastify";

const CleanlinessReport = ({ setLoggedIn }) => {
  const [modalShow, setModalShow] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedFloat, setSelectedFloat] = useState("");
  const [cleanlinessData, setCleanlinessData] = useState([]);
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
        "http://3.141.203.3:5025/api/CleanlinessFileUpload/GetCleanlinessReport",
        body
      );

      const data = response.data.data;

      if (!data) {
        setDataExists(false);
        setLoading(false);
        return;
      }

      data?.forEach((item) => {
        Floats.forEach((float) => {
          if (float.id == item.floatId) {
            item.floatName = float.name?.includes("CI")
              ? "CI"
              : float.name.includes("2")
              ? "GSI 2"
              : "GSI 1";

            item.userId = item?.email?.split("@")[0] || "Unknown";
            item.userId = item.userId?.includes("CI")
              ? item.userId.slice(2)
              : item.userId.slice(4);

            item.image1 = item.previewImageUrl[0].includes("drive.google.com")
              ? "https://drive.google.com/uc?export=view&id=" +
                item.previewImageUrl[0].slice(32).split("/")[0]
              : item.previewImageUrl[0];
            item.image2 = item.previewImageUrl[1].includes("drive.google.com")
              ? "https://drive.google.com/uc?export=view&id=" +
                item.previewImageUrl[1].slice(32).split("/")[1]
              : item.previewImageUrl[1];
            item.image3 = item.previewImageUrl[2].includes("drive.google.com")
              ? "https://drive.google.com/uc?export=view&id=" +
                item.previewImageUrl[2].slice(32).split("/")[2]
              : item.previewImageUrl[2];
            item.image4 = item.previewImageUrl[3].includes("drive.google.com")
              ? "https://drive.google.com/uc?export=view&id=" +
                item.previewImageUrl[3].slice(32).split("/")[3]
              : item.previewImageUrl[3];
          }
        });
      });

      setCleanlinessData(data);
      setDataExists(true);
      setServerError(false);
      setLoading(false);
    } catch (err) {
      console.log("Api/Server Error while getting floats data ", err);
      setServerError(true);
      setDataExists(false);
      setLoading(false);
    }
  };

  const exportedTableHeaders = [
    { label: "Date", key: "date" },
    { label: "User ID", key: "userId" },
    { label: "Float Name", key: "floatName" },
    { label: "Status", key: "status" },
    { label: "Image1", key: "image1" },
    { label: "Image2", key: "image2" },
    { label: "Image3", key: "image3" },
    { label: "Image4", key: "image4" },
  ];

  const showModal = (image) => {
    let picture = image.includes("drive.google.com")
      ? "https://drive.google.com/uc?export=view&id=" +
        image.slice(32).split("/")[0]
      : image;

    setUserImage(picture);
    setModalShow(true);
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
                    {float.name}
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
                    <th>Date</th>
                    <th>User ID</th>
                    <th>Float Name</th>
                    <th>Status </th>
                    <th>Image-1</th>
                    <th>Image-2</th>
                    <th>Image-3</th>
                    <th>Image-4</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanlinessData.map((float) => {
                    return (
                      <tr key={uuidv4()}>
                        <td>{float.date}</td>
                        <td>{float.userId}</td>
                        <td>{float.floatName}</td>
                        <td>{float.status}</td>
                        {/* prettier-ignore */}
                        {/* <td>
                          {float.previewImageUrl.map((image) => (
                            <a onClick={() => showModal(image)}> <img src={ image.includes("drive.google.com") ?  "  https://drive.google.com/uc?export=view&id=" + image.slice(32).split("/")[0] : image } className={classes.userImage} /> </a>
                          ))}
                        </td> */}
                        {/* prettier-ignore */}
                        <td> <a onClick={() => showModal(float.image1)}> <img src={float.image1} className={classes.userImage} /> </a> </td>
                        {/* prettier-ignore */}
                        <td> <a onClick={() => showModal(float.image2)}> <img src={float.image2} className={classes.userImage} /> </a> </td>
                        {/* prettier-ignore */}
                        <td> <a onClick={() => showModal(float.image3)}> <img src={ float.image3} className={classes.userImage} /> </a> </td>
                        {/* prettier-ignore */}
                        <td> <a onClick={() => showModal(float.image4)}> <img src={ float.image4 } className={classes.userImage} /> </a> </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {dataExists && !loading && !serverError && (
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

export default CleanlinessReport;
