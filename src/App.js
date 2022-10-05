import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserInterceptionReport from "./pages/userInterception/UserInterceptionReport";
import AttendanceReport from "./pages/attendance/AttendanceReport";
import StockReport from "./pages/stock/StockReport";
import CleanlinessReport from "./pages/cleanliness/CleanlinessReport";
import CustomerFeedbackReport from "./pages/customerFeedback/CustomerFeedbackReport";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  if (!loggedIn) {
    if (localStorage.getItem("ali123@gmail.com")) setLoggedIn(true);
    else {
      return <Login setLoggedIn={setLoggedIn} />;
    }
  }

  return (
    <div>
      <Footer />
      {/* prettier-ignore */}
      <Routes>
        <Route path="/user-interception-report" exact element={<UserInterceptionReport setLoggedIn={setLoggedIn} />} />
        <Route path="/attendance-report" exact element={<AttendanceReport  setLoggedIn={setLoggedIn} />} />
        <Route path="/stock-report" exact element={<StockReport setLoggedIn={setLoggedIn}  />} />
        <Route path="/cleanliness-report" exact element={<CleanlinessReport setLoggedIn={setLoggedIn} />} />
        <Route path="/customer-feedback-report" exact element={<CustomerFeedbackReport setLoggedIn={setLoggedIn} />} />
        <Route path="*" element={<UserInterceptionReport setLoggedIn={setLoggedIn}  />} />
      </Routes>
      <Sidebar />
    </div>
  );
};

export default App;
