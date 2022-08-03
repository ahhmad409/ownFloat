import React from "react";
import ReactExport from "react-data-export";
import { Table, Row, Col } from "react-bootstrap";
import style from "./Report.module.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const VisitorReportData = (props) => {
  const { visitorData, date } = props;
  const name = `Visitor_Report_${date}`;
  return (
    <div>
      <ExcelFile
        filename={name}
        element={<button type="button">Download Data</button>}
      >
        <ExcelSheet data={visitorData} name="Visitor Report">
          <ExcelColumn label="User" value="user" />
          <ExcelColumn label="Date" value="date" />
          <ExcelColumn label="Visitor Name" value="visitorname" />
          <ExcelColumn label="Message" value="message" />
        </ExcelSheet>
      </ExcelFile>
      <div className={style.container}>
        <h2>VISION DIRECT MARKETING </h2>
        <p>Daily Visitor Report</p>
        <Row>
          <Col md={3}>Date: {new Date(date).toDateString()}</Col>
        </Row>
        <Table striped hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Visitor Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {visitorData.map((prop, index) => (
              <tr key={index}>
                <td>{prop.user}</td>
                <td>{prop.date}</td>
                <td>{prop.visitorname}</td>
                <td>{prop.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default VisitorReportData;
