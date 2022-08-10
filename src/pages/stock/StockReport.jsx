import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import classes from "../commonStyles.module.scss";
import Header from "../../components/Header/Header";
import { datesValidation } from "../datesValidation";
// import classes from "./StockReport.module.scss";

const StockReport = ({ setLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [stockLoad, setStockLoad] = useState([]);
  const [consumerData, setConsumerData] = useState([]);
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);

  let classic = {
    prevStock: 0,
    loadStock: 0,
    sale: 0,
    prevSale: 0,
    brand: "Classic",
  };
  let GSI = {
    prevStock: 0,
    loadStock: 0,
    sale: 0,
    prevSale: 0,
    brand: "GSI",
  };

  const searchHandler = () => {
    if (!datesValidation(fromDate, toDate)) return;
    getStockLoad();
  };

  const getStockLoad = async () => {
    setLoading(true);

    // prettier-ignore
    try{
      const body = {
        fromDate: fromDate,
        toDate: toDate,
      };

    const res = await axios.post("http://3.141.203.3:8010/api/StockLoad/GetStockReport", body );
    const stockLoad = res.data.data; 

    users.forEach((user)=>{
      stockLoad.forEach((item)=>{
        if(item.userId == user.fireStoreId){
          item.userId = user?.email?.split("@")[0];
        }
      })
    })
    
    setStockLoad(stockLoad);
    setDataExists(true);
    setServerError(false);
    setLoading(false);
  }catch(err){
    console.log("Api/Server Error while getting stocks data ", err);
    setServerError(true);
    setDataExists("Something went wrong");
    setLoading(false);
  }

    let fromDatee = fromDate.replace(/-/g, "/");
    let toDatee = toDate.replace(/-/g, "/");

    stockLoad.map((item) => {
      let itemDate = item.date.replace(/-/g, "/");

      if (item.brand == "Classic") {
        if (itemDate >= fromDatee && itemDate <= toDatee) {
          classic = {
            ...classic,
            loadStock: classic.loadStock + Number(item.stockLoad),
          };
        } else if (itemDate < fromDate) {
          classic = {
            ...classic,
            prevStock: classic.prevStock + Number(item.stockLoad),
          };
        }
      } else if (item.brand == "GSI") {
        if (itemDate >= fromDatee && itemDate <= toDatee) {
          GSI = {
            ...GSI,
            loadStock: GSI.loadStock + Number(item.stockLoad),
          };
        } else if (itemDate < fromDate) {
          GSI = {
            ...GSI,
            prevStock: GSI.prevStock + Number(item.stockLoad),
          };
        }
      }
    });

    // prettier-ignore
    axios.post("http://3.141.203.3:8010/api/ConsumerDataForm/Get",{
      brandName: null,
      userId:  null,
      dateFrom: fromDate,
      dateTo: toDate,
    }).then((res)=>{
      setConsumerData(res.data.data);
    }).catch((err)=>{
      console.log("Api/Server Error while getting consumer data ", err);
    })

    consumerData.map((item) => {
      let itemDate = item.date.split("T")[0].replace(/-/g, "/");

      if (item.callStatus == "Productive") {
        if (item.currentBrand == "Classic") {
          if (itemDate >= fromDatee && itemDate <= toDatee) {
            classic = {
              ...classic,
              sale: classic.sale + 1,
            };
          } else if (itemDate < fromDatee) {
            classic = {
              ...classic,
              prevSale: classic.prevSale + 1,
            };
          }
        } else if (item.currentBrand == "GSI") {
          if (itemDate >= fromDatee && itemDate <= toDatee) {
            GSI = {
              ...GSI,
              sale: GSI.sale + 1,
            };
          } else if (itemDate < fromDatee) {
            GSI = {
              ...GSI,
              prevSale: GSI.prevSale + 1,
            };
          }
        }
      }
    });

    setData([classic, GSI]);

    setExportData([
      {
        // userID: "GSI2SP",
        from: fromDate,
        to: toDate,
        brand: classic.brand,
        opening: classic.prevStock - classic.prevSale,
        loadStock: classic.loadStock,
        sale: classic.sale,
        balance:
          classic.prevStock +
          classic.loadStock -
          (classic.prevSale + classic.sale),
      },
      {
        // userID: "GSI2SP",
        from: fromDate,
        to: toDate,
        brand: GSI.brand,
        opening: GSI.prevStock - GSI.prevSale,
        loadStock: GSI.loadStock,
        sale: GSI.sale,
        balance: GSI.prevStock + GSI.loadStock - (GSI.prevSale + GSI.sale),
      },
    ]);
  };

  const exportedTableHeaders = [
    // { label: "User ID", key: "data.date" },
    { label: "From", key: "data.time" },
    { label: "To", key: "data.territoryName" },
    { label: "Brand", key: "data.town" },
    { label: "Opening", key: "data.userId" },
    { label: "Load Stock", key: "data.name" },
    { label: "Sale", key: "data.cnic" },
    { label: "Balance", key: "data.cellNo" },
  ];

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://3.141.203.3:8010/api/Authentication/fetchallusers"
      );
      setUsers(response.data.data);
    } catch (err) {
      console.log("Api/Server Error while getting users ", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={classes.wrapperr}>
      <Header text="Stock Report" setLoggedIn={setLoggedIn} />
      <Card className={classes.cardd}>
        <p className={classes.fileHeadingg}>Stock Report</p>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
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
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="warning"
                onClick={searchHandler}
                className={classes.searchBtn}
                disabled={!fromDate || !toDate}
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
                    {/* <th>User ID</th> */}
                    <th>From</th>
                    <th>To</th>
                    <th>Brand</th>
                    <th>Opening</th>
                    <th>Load Stock</th>
                    <th>Sale</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    return (
                      <tr key={uuidv4()}>
                        {/* <td>{data.userId || "GSI2SP"}</td> */}
                        <td>{fromDate}</td>
                        <td>{toDate}</td>
                        <td>{item.brand}</td>
                        <td>{item.prevStock - item.prevSale}</td>
                        <td>{item.loadStock}</td>
                        <td>{item.sale}</td>
                        <td>
                          {item.prevStock +
                            item.loadStock -
                            (item.prevSale + item.sale)}
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
              data={exportData}
              filename={"StockReport.csv"}
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

export default StockReport;
