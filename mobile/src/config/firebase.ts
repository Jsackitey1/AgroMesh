import { initializeApp } from '@react-native-firebase/app';
import appDistribution from '@react-native-firebase/app-distribution';

// Your Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCzzSujRIERxd41oN2gAnXvzKxM60I-ITY",
  authDomain: "agromesh-495d4.firebaseapp.com",
  projectId: "agromesh-495d4",
  storageBucket: "agromesh-495d4.firebasestorage.app",
  messagingSenderId: "498338987011",
  appId: "1:498338987011:android:73752f4a535bb451356236"
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