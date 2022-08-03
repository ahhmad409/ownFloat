import React, { useState, useEffect, useRef } from "react";
import { CSVLink, CSVDownload } from "react-csv";
//prettier-ignore
import classes from "./CleanlinessReport.module.scss";
import { v4 as uuidv4 } from "uuid";
//prettier-ignore
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import fire from "../../helpers/fire";
import Card from "../../components/Card/Card.jsx";
import mapIcon from "../mapIcon.png";
import Button from "../../components/CustomButton/CustomButton";

const CleanlinessReport = () => {
  // const [floats, setFloats] = useState([]);
  // const [selectedFloat, setSelectedFloat] = useState(""); // selectedFloat is a floatId and not float itself
  // const [cleanlinessData, setCleanlinessData] = useState([]);
  // const [loadingCleanliness, setLoadingCleanliness] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [userImage, setUserImage] = useState("");
  // const [floatName, setFloatName] = useState("");
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  // const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

  // const refFloat = fire.firestore().collection("Float");
  // const refCleanliness = fire.firestore().collection("Cleanliness");

  // const searchHandler = () => {
  //   if (!datesValidation()) return;

  //   getCleanliness();
  // };

  // const getFLoats = () => {
  //   const fetchedFloats = [];
  //   refFloat.get().then((res) => {
  //     res.docs.map((float) => {
  //       fetchedFloats.push(float.data());
  //     });
  //     setFloats(fetchedFloats);
  //   });
  // };

  // const getFloatName = () => {
  //   refFloat
  //     .where("id", "==", selectedFloat)
  //     .get()
  //     .then((res) => {
  //       console.log(res.docs);
  //       console.log(selectedFloat);
  //     });
  // };

  // const getCleanliness = () => {
  //   setLoadingCleanliness(true);
  //   if (selectedFloat === "allfloats") {
  //     const fetchedCleanlinessData = [];
  //     refCleanliness.get().then((res) => {
  //       res.docs.map((clean) => {
  //         fetchedCleanlinessData.push(clean.data());
  //       });

  //       let [fromDate, toDate] = datesValidation();
  //       setCleanlinessData(
  //         fetchedCleanlinessData.filter((data) => {
  //           const dataDate = data.date.replace(/-/g, "/");
  //           if (dataDate >= fromDate && dataDate <= toDate) {

  //             floats.forEach((float) => {
  //               if (data.floatId == float.id) {
  //                 data.floatName = float.name;
  //               }
  //             });

  //             return data;
  //           }
  //         })
  //       );

  //       setLoadingCleanliness(false);
  //     });
  //   } else {
  //     const fetchedCleanlinessData = [];
  //     refCleanliness
  //       .where("floatId", "==", selectedFloat)
  //       .get()
  //       .then((res) => {
  //         res.docs.map((clean) => {
  //           fetchedCleanlinessData.push(clean.data());
  //         });

  //         let [fromDate, toDate] = datesValidation();
  //         setCleanlinessData(
  //           fetchedCleanlinessData.filter((data) => {
  //             const dataDate = data.date.replace(/-/g, "/");
  //             if (dataDate >= fromDate && dataDate <= toDate) {
  //               data.floatName = floatName;
  //               return data;
  //             }
  //           })
  //         );

  //         setLoadingCleanliness(false);
  //       });
  //   }
  // };

  // const showModal = (image) => {
  //   setIsModalOpen(true);
  //   let picture =
  //     "https://drive.google.com/uc?export=view&id=" +
  //     image.slice(32).split("/")[0];
  //   setUserImage(picture);
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
  //   getFLoats();
  // }, []);

  return (
    <div className="content">
      {/* <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Cleanliness Report"
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
                        <ControlLabel>Select Float</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          className="form-controll"
                          value={selectedFloat}
                          onChange={(event) => {
                            setSelectedFloat(event.target.value);
                            floats.map((float) => {
                              if (float.id == event.target.value) {
                                setFloatName(float.name);
                              }
                            });
                          }}
                        >
                          <option value="" disabled>
                            select
                          </option>
                          <option value="allfloats">All Floats</option>
                          {floats.length > 0 ? (
                            floats.map((float) => (
                              <option key={uuidv4()} value={float.id}>
                                {float.name}
                              </option>
                            ))
                          ) : (
                            <option>Fetching....</option>
                          )}
                        </FormControl>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <Button
                        bsStyle="warning"
                        pullRight
                        fill
                        disabled={!selectedFloat || !fromDate || !toDate}
                        onClick={searchHandler}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  {loadingCleanliness ? (
                    <p className={classes.para}>Loading...</p>
                  ) : cleanlinessData.length > 0 ? (
                    <Row>
                      <div
                        className={`table-responsive ${classes.tableResponsive}`}
                      >
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
                            {cleanlinessData.map((data) => (
                              <tr key={uuidv4()}>
                                <td>{data.date}</td>
                                <td>
                                  {data.PreviewImageUrl.map((image) => (
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
                                <th>{data.Status} </th>
                                <td> {data.floatName || "Float"} </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <CSVLink
                        data={cleanlinessData}
                        filename={"CleanlinessReport.csv"}
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
            className={`${classes.closeModal} ${classes.textWhite}`}
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
      Cleanliness Report
    </div>
  );
};

export default CleanlinessReport;
