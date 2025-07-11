import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCbbr_G-0a2PGuTMvBEope3tSefN4r4JBg",
  authDomain: "funspacefacts-2eaff.firebaseapp.com",
  projectId: "funspacefacts-2eaff",
  storageBucket: "funspacefacts-2eaff.firebasestorage.app",
  messagingSenderId: "309407365379",
  appId: "1:309407365379:web:b84e439a52d6f8ef8ad136",
  measurementId: "G-GHKY2NYF8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export{ auth, db };