// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDhIJ4a4mEHbLYDXmOXorGe0VJ4l6XVqFE",
  authDomain: "finaldemo-38f19.firebaseapp.com",
  projectId: "finaldemo-38f19",
  storageBucket: "finaldemo-38f19.firebasestorage.app",
  messagingSenderId: "260614975704",
  appId: "1:260614975704:web:c215f2d1fc257d522da7ad",
  measurementId: "G-0LV0B261XQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔁 Toggle between login and signup forms
window.toggleForms = () => {
  document.getElementById("login-form").classList.toggle("hidden");
  document.getElementById("signup-form").classList.toggle("hidden");
};

// ✨ SIGNUP logic
const signupForm = document.querySelector("#signup-form form");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user info in Firestore
    await setDoc(doc(db, "usercreds", user.uid), {
      name,
      email,
      uid: user.uid
    });

    alert("Account created successfully!");
    window.location.href = "customer-login/index.html"; // Redirect after signup
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// ✨ LOGIN logic with smart redirect
const loginForm = document.querySelector("#login-form form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔍 First check in providercreds
    const providerQuery = query(collection(db, "providercreds"), where("email", "==", email));
    const providerSnap = await getDocs(providerQuery);

    if (!providerSnap.empty) {
      // ✅ Redirect to provider dashboard
      window.location.href = "provider_dashboard.html";
      return;
    }

    // 🔍 Then check in usercreds
    const userQuery = query(collection(db, "usercreds"), where("email", "==", email));
    const userSnap = await getDocs(userQuery);

    if (!userSnap.empty) {
      // ✅ Redirect to customer main page
      window.location.href = "customer-login/index.html";
      return;
    }

    alert("No matching credentials found in database.");
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
