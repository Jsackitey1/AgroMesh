import { initializeApp } from '@react-native-firebase/app';
import appDistribution from '@react-native-firebase/app-distribution';

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.warn('⚠️ Missing Firebase configuration keys:', missingKeys);
  console.warn('Firebase features will be disabled. Please set the required environment variables.');
}

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