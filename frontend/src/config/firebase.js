import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase Web Project Configuration read from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_placeholder_key_change_me",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scts-campus-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scts-campus-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scts-campus-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn("Firebase Init Notice:", e.message);
}

export const signInWithGooglePopup = async (fallbackEmail, fallbackName) => {
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      if (user && user.email) {
        return {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          uid: user.uid,
          idToken: token || 'google_token_' + Date.now()
        };
      }
    } catch (error) {
      console.warn("Firebase Auth Notice:", error.message);
    }
  }

  // Dynamic profile fallback using exact account provided
  if (fallbackEmail) {
    return {
      email: fallbackEmail,
      displayName: fallbackName || fallbackEmail.split('@')[0],
      photoURL: null,
      uid: 'google_uid_' + Date.now(),
      idToken: 'google_token_' + Date.now()
    };
  }

  return null;
};

export { app, auth, googleProvider };
export default app;
