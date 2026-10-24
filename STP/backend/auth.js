import { auth, isConfigured } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const formatUser = (firebaseUser) => {
  if (!firebaseUser) return null;
  const username = firebaseUser.displayName || '';
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: username,
    user_metadata: {
      username: username
    }
  };
};

const formatAuthError = (error, isLogin = false) => {
  const code = error.code || '';
  if (
    code === 'auth/user-not-found' || 
    code === 'auth/invalid-credential' || 
    code === 'auth/wrong-password' ||
    code === 'auth/configuration-not-found'
  ) {
    return isLogin 
      ? 'May be you are entering a wrong password, or the account is not created (signup to create an account!)' 
      : 'Invalid credentials. Please verify your details.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email already exists. Please log in instead.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/weak-password') {
    return 'Password should be at least 6 characters.';
  }
  return error.message || 'Authentication error';
};

export const signUp = async (email, password) => {
  if (!isConfigured || !auth) {
    throw new Error('Please configure your Firebase credentials in js/config.js first.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: formatUser(userCredential.user), session: userCredential.user };
  } catch (error) {
    throw new Error(formatAuthError(error, false));
  }
};

export const logIn = async (email, password) => {
  if (!isConfigured || !auth) {
    throw new Error('Please configure your Firebase credentials in js/config.js first.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: formatUser(userCredential.user), session: userCredential.user };
  } catch (error) {
    throw new Error(formatAuthError(error, true));
  }
};

export const updateUsername = async (username) => {
  if (!isConfigured || !auth || !auth.currentUser) {
    throw new Error('No user is currently signed in.');
  }
  try {
    await updateProfile(auth.currentUser, { displayName: username });
    return { user: formatUser(auth.currentUser) };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  if (!isConfigured || !auth) return;
  await signOut(auth);
};

export const verifyPasswordAndLogOut = async (password) => {
  if (!isConfigured || !auth || !auth.currentUser) {
    throw new Error('No user is currently signed in.');
  }
  const email = auth.currentUser.email;
  const credential = EmailAuthProvider.credential(email, password);
  try {
    await reauthenticateWithCredential(auth.currentUser, credential);
    await signOut(auth);
  } catch (error) {
    const code = error.code || '';
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      throw new Error('Incorrect password. Logout cancelled.');
    }
    throw new Error(error.message || 'Failed to verify password.');
  }
};

export const getSession = async () => {
  if (!isConfigured || !auth || !auth.currentUser) return null;
  return { user: formatUser(auth.currentUser) };
};

export const onAuthStateChange = (callback) => {
  if (!isConfigured || !auth) {
    callback(null);
    return;
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({ user: formatUser(user) });
    } else {
      callback(null);
    }
  });
};
