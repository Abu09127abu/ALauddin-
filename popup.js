import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzxSL6N7FOXC8FuM6v11qJRODLIC4TJXE",
  authDomain: "app-telegram-f4101.firebaseapp.com",
  databaseURL: "https://app-telegram-f4101-default-rtdb.firebaseio.com",
  projectId: "app-telegram-f4101",
  storageBucket: "app-telegram-f4101.firebasestorage.app",
  messagingSenderId: "67113105635",
  appId: "1:67113105635:web:2d6049641a5b6ebca6edd6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elements for popup
const createProfilePopup = () => {
  const popup = document.createElement("div");
  popup.id = "profilePopup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "999";

  popup.innerHTML = `
    <div style="background-color: #1c1c1c; padding: 20px; border-radius: 10px; width: 80%; text-align: center; color: white;">
      <h2>Complete Your Profile</h2>
      <form id="profileForm">
        <input type="text" id="name" placeholder="Name" style="width: 100%; margin-bottom: 10px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
        <input type="text" id="username" placeholder="Username" style="width: 100%; margin-bottom: 10px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
        <input type="text" id="tonAddress" placeholder="TON Address" style="width: 100%; margin-bottom: 10px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
        <select id="gender" style="width: 100%; margin-bottom: 10px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" style="padding: 10px 20px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
      </form>
    </div>
  `;

  document.body.appendChild(popup);

  const form = document.getElementById("profileForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveProfile();
  });
};

// Save profile data to local storage and Firebase
const saveProfile = () => {
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const tonAddress = document.getElementById("tonAddress").value;
  const gender = document.getElementById("gender").value;

  if (!name || !username || !tonAddress || !gender) {
    
    return;
  }

  const userData = { name, username, tonAddress, gender, abcoin: localStorage.getItem("abcoin") || 0 };

  // Save to local storage
  localStorage.setItem("profile", JSON.stringify(userData));

  // Save to Firebase
  const userRef = ref(database, `users/${username}`);
  set(userRef, userData);

  // Close the popup
  document.getElementById("profilePopup").remove();
  syncABCoin();
};

// Check if the popup needs to show
const showProfilePopup = () => {
  if (!localStorage.getItem("profile")) {
    createProfilePopup();
  } else {
    syncABCoin();
  }
};

// Sync AB Coin between local storage and Firebase
const syncABCoin = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile || !profile.username) return;

  const userRef = ref(database, `users/${profile.username}`);

  // Sync Firebase changes to local storage
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.abcoin !== undefined) {
      localStorage.setItem("abcoin", data.abcoin);
      updateABCoinCounter();
    }
  });

  // Watch local storage for changes and update Firebase
  let currentABCoin = localStorage.getItem("abcoin") || 0;
  setInterval(() => {
    const newABCoin = localStorage.getItem("abcoin") || 0;
    if (newABCoin !== currentABCoin) {
      currentABCoin = newABCoin;
      update(userRef, { abcoin: currentABCoin });
    }
  }, 1000);
};

// Update AB Coin counter on the page
const updateABCoinCounter = () => {
  const abcoinCounter = document.getElementById("abCoinCounter");
  const abcoin = localStorage.getItem("abcoin") || 0;
  if (abcoinCounter) abcoinCounter.textContent = abcoin;
};

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", () => {
  showProfilePopup();
  updateABCoinCounter();
});