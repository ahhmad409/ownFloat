import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserInterceptionReport from "./pages/userInterception/UserInterceptionReport";
import AttendanceReport from "./pages/attendance/AttendanceReport";
import StockReport from "./pages/stock/StockReport";
import CleanlinessReport from "./pages/cleanliness/CleanlinessReport";
import CustomerFeedbackReport from "./pages/customerFeedback/CustomerFeedbackReport";
import Sidebar from "./components/Sidebar/Sidebar";
// import Login from "./pages/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  // const [loggedIn, setLoggedIn] = useState(false);
  // if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  return (
    <div>
      <Sidebar />
      {/* prettier-ignore */}
      <Routes>
        <Route path="/user-interception-report" exact element={<UserInterceptionReport />} />
        <Route path="/attendance-report" exact element={<AttendanceReport />} />
        <Route path="/stock-report" exact element={<StockReport />} />
        <Route path="/cleanliness-report" exact element={<CleanlinessReport />} />
        <Route path="/customer-feedback-report" exact element={<CustomerFeedbackReport />} />
        <Route path="*" element={<UserInterceptionReport />} />
      </Routes>
    </div>
  );
};

export default App;
