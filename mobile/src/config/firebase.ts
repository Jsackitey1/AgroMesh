import { initializeApp } from '@react-native-firebase/app';
import appDistribution from '@react-native-firebase/app-distribution';

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCzzSujRIERxd41oN2gAnXvzKxM60I-ITY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "agromesh-495d4.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "agromesh-495d4",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "agromesh-495d4.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "498338987011",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:498338987011:android:73752f4a535bb451356236"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Distribution
if (__DEV__) {
  appDistribution()
    .isTesterSignedIn()
    .then((isTesterSignedIn) => {
      if (!isTesterSignedIn) {
        // Sign in tester
        return appDistribution().signInTester();
      }
    })
    .then(() => {
      // Check for update
      return appDistribution().checkForUpdate();
    })
    .catch((error) => {
      console.log('App Distribution error:', error);
    });
}

export default app; 