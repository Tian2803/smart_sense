import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW9-J6k1CbOHOzNuMmE_b1XzXi609gtXU",
  authDomain: "sense-iot-ddd4f.firebaseapp.com",
  databaseURL: "https://sense-iot-ddd4f-default-rtdb.firebaseio.com",
  projectId: "sense-iot-ddd4f",
  storageBucket: "sense-iot-ddd4f.firebasestorage.app",
  messagingSenderId: "787964038285",
  appId: "1:787964038285:web:265c952de88f75360ba6c4",
  measurementId: "G-PP78QKLGZ6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
