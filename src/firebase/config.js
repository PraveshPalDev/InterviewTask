// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDkI3k6GOXGOL-NqYwwOJ1ZbDLtc6g5BEY',
  authDomain: 'interviewapp-299f9.firebaseapp.com',
  projectId: 'interviewapp-299f9',
  storageBucket: 'interviewapp-299f9.firebasestorage.app',
  messagingSenderId: '298950216382',
  appId: '1:298950216382:web:09c5373bcb809e7f5b2cef',
  measurementId: 'G-PC0Q4KNNYQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
