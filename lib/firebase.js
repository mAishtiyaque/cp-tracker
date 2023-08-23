import { initializeApp,getApps } from 'firebase/app';
//import 'firebase/auth';

const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
// if a Firebase instance doesn't exist, create one
//if (!firebase.apps.length) {
const app = initializeApp(firebaseConfig)

//}
//console.log(app)

// let app;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps();
// }

export default app;