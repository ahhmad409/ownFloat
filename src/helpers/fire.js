import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDG0nh-rLfKP-ewrlwoW2atbgwl6bNqaPw",
  authDomain: "androidfloat.firebaseapp.com",
  databaseURL: "https://androidfloat-default-rtdb.firebaseio.com",
  projectId: "androidfloat",
  storageBucket: "androidfloat.appspot.com",
  messagingSenderId: "553288027806",
  appId: "1:553288027806:web:ade7f60889c3d380afb58f",
};

const fire = initializeApp(firebaseConfig);
export default fire;
