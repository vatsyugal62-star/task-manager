import { FIREBASE_CONFIG } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

let app = null;
let auth = null;
let db = null;
let isConfigured = false;

// Check if credentials have been provided
if (
  FIREBASE_CONFIG && 
  FIREBASE_CONFIG.apiKey && 
  !FIREBASE_CONFIG.apiKey.startsWith('YOUR_') &&
  FIREBASE_CONFIG.projectId &&
  !FIREBASE_CONFIG.projectId.startsWith('YOUR_')
) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    // Initialize Firestore with multi-tab offline persistence
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    isConfigured = true;
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export { app, auth, db, isConfigured };
