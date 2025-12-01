import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMzUzhs76f7kraqXv9in8gZVlf9BFLvbw",
  authDomain: "clg-project-e02e5.firebaseapp.com",
  projectId:  "clg-project-e02e5",
  messagingSenderId: "158612255996",
  appId: "1:158612255996:web:e257f45730627ebebf9379",
  measurementId: "G-ZS1Y8W9KLZ"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const setupRecaptcha = () => {
  // Jab tak window.recaptchaVerifier nahi bana, tab tak hi banao
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,                      // <- First argument = auth
      "recaptcha-container",     // <- UI div id
      {
        size: "normal",       // Invisible recaptcha
        callback: (response) => {
          console.log("Recaptcha Verified");
        },
      }
    );
  }
};
