import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc0PZQWi0DMb6pIJNqRrjhoIFHFwoWAqA",
  authDomain: "gip-database-dbsdw.firebaseapp.com",
  projectId: "gip-database-dbsdw",
  storageBucket: "gip-database-dbsdw.appspot.com",
  messagingSenderId: "1082491651293",
  appId: "1:1082491651293:web:87a4bebe1b6b0d324d4734",
  measurementId: "G-GV2E81132V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db }