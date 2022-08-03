import React from "react";
import ReactExport from "react-data-export";
import { Table, Row, Col } from "react-bootstrap";
import style from "./Report.module.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const CustomerProductReport = (props) => {
  const { customerData, date } = props;
  const multiDataSet = [
    {
      columns: [
        {
          title: "VISION DIRECT MARKETING",
          style: {
            font: { sz: "24", bold: true },
          },
        },
      ],
      data: [
        [
          {
            value: `${customerData.companyName} In-Store Activity`,
            style: {
              font: { sz: "13" },
            },
          },
        ],
        [
          {
            value: "Daily Store Sale Report",
            style: {
              font: { sz: "13" },
            },
          },
        ],
      ],
    },
    {
      ySteps: 1,
      columns: [
        {
          title: "Date",
          style: {
            font: { sz: "12", bold: true },
          },
        },
        {
          title: "Store Name",
          style: {
            font: { sz: "12", bold: true },
          },
        },
      ],
      data: [
        [
          {
            value: `${new Date(date).toDateString()}`,
            style: {
              font: { sz: "12" },
            },
          },
          {
            value: `${customerData.storeName}`,
            style: {
              font: { sz: "12" },
            },
          },
        ],
      ],
    },
    {
      ySteps: 1,
      columns: [
        {
          title: "Customer Name",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
        {
          title: "Contact Number",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
        {
          title: "Product Name",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
        {
          title: "Quantity",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
        {
          title: "Required In",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
        {
          title: "Remarks",
          style: {
            font: { sz: "13", bold: true },
            fill: { fgColor: { rgb: "ffc299" } },
          },
        },
      ],
      data: customerData.customers.map((cust) => [
        { value: cust.customerName },
        { value: cust.phoneNumber },
        { value: cust.productname },
        { value: cust.quantity },
        { value: cust.requiredIn },
        { value: "" },
      ]),
    },
  ];
  return (
    <div>
      <ExcelFile
        filename="Customer Products"
        element={<button type="button">Download Data</button>}
      >
        <ExcelSheet dataSet={multiDataSet} name="Customer Products Report" />
      </ExcelFile>
      <div className={style.container}>
        <h2>VISION DIRECT MARKETING </h2>
        <p>{customerData.companyName} In-Store Activity</p>
        <p>Daily Store Sale Report</p>
        <Row>
          <Col md={3}>Date: {new Date(date).toDateString()}</Col>
          <Col md={3}>BA name: </Col>
          <Col md={3}>Check In & Check Out: </Col>
          <Col md={3}>Store Name: {customerData.storeName}</Col>
        </Row>
        <Table striped hover>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Req.In</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {customerData.customers.map((prop, index) => (
              <tr key={index}>
                <td>{prop.customerName}</td>
                <td>{prop.phoneNumber}</td>
                <td>{prop.productname}</td>
                <td>{prop.quantity}</td>
                <td>{prop.requiredIn}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerProductReport;
