// Get Users  (Get Request)
const users = "http://3.141.203.3:8010/api/Authentication/fetchallusers";

//  ConsumerData Report  (Post Request)
const consumerData = "http://3.141.203.3:8010/api/ConsumerDataForm/Get";

const body1 = {
  brandName: null,
  userId: null,
  dateFrom: null, // "yyyy-mm-dd"
  dateTo: null, // "yyyy-mm-dd"
};

// StockLoad Report (Post Request)
const stockLoad = "http://3.141.203.3:8010/api/StockLoad/GetStockReport";

const body2 = {
  fromDate: null, // "yyyy-mm-dd"
  toDate: null, // "yyyy-mm-dd"
};

// Cleanliness Report (Post Request)
const cleanliness =
  "http://3.141.203.3:8010/api/CleanlinessFileUpload/GetCleanlinessReport";

const body3 = {
  floatId: null,
  fromDate: null, // "dd/mm/yyyy"
  toDate: null, // "dd/mm/yyyy"
};

// Attendance Report (Post Request)
const attendance = "http://3.141.203.3:8010/api/attendence/GetAttendenceReport";

const body4 = {
  fromDate: null, // "yyyy-mm-dd"
  toDate: null, // "yyyy-mm-dd"
  user: null,
};

// Feedback Report (Post Request)
const feedback = "http://3.141.203.3:8010/api/FeedBack/GetFeedBackReport";

const body5 = {
  fromDate: null, // "yyyy-mm-dd"
  toDate: null, // "yyyy-mm-dd"
  user: null,
};
