import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const progressKey = 'moneysmart-progress';
const savingsGoalKey = 'moneysmart-savings-goal';
const localProgressSnapshotKey = 'moneysmart-local-progress-snapshot';
const localSavingsSnapshotKey = 'moneysmart-local-savings-snapshot';
const authForm = document.getElementById('authForm');
const authSection = document.getElementById('account');
const authStatus = document.getElementById('authStatus');
const passwordInput = document.getElementById('authPassword');
const passwordHint = document.getElementById('passwordHint');
const authSubmit = document.getElementById('authSubmit');
const modeToggle = document.getElementById('authModeToggle');
const emailInput = document.getElementById('authEmail');
const learningContent = document.getElementById('learningContent');
const learningFooter = document.getElementById('learningFooter');
const appHeader = document.getElementById('appHeader');
const appNavigation = document.getElementById('appNavigation');
const appNavActions = document.getElementById('appNavActions');
const accountMode = { createAccount: false };
let currentUser = null;
let userDataReady = false;
let authStateVersion = 0;

function setStatus(message, isError = false) {
  if (!authStatus) return;
  authStatus.textContent = message;
  authStatus.classList.toggle('is-error', isError);
}

function getFirebaseErrorMessage(error) {
  const errorCode = error && typeof error.code === 'string' ? error.code : '';
  if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
    return 'Incorrect email or password.';
  }
  if (errorCode === 'auth/email-already-in-use') {
    return 'An account already exists for this email. Sign in instead.';
  }
  if (errorCode === 'auth/weak-password') {
    return 'Choose a stronger password with at least 8 characters, an uppercase letter, a number, and a special character.';
  }
  if (errorCode === 'auth/configuration-not-found' || errorCode === 'auth/operation-not-allowed') {
    return 'Email/password sign-in is not enabled in Firebase Authentication.';
  }
  if (errorCode === 'auth/invalid-api-key') {
    return 'Firebase rejected the API key. Check firebase-config.js.';
  }
  if (errorCode === 'auth/unauthorized-domain') {
    return 'This website address is not authorized in Firebase Authentication.';
  }
  return 'Unable to sign in right now. Please try again.';
}

function reportCloudError(error) {
  console.error('MoneySmart Firebase error:', error);
  const message = getFirebaseErrorMessage(error);
  window.dispatchEvent(new CustomEvent('moneysmart:cloud-error', { detail: { message } }));
  setStatus(`Firebase error: ${message}`, true);
}

function parseStoredValue(key) {
  const rawValue = localStorage.getItem(key);
  return rawValue ? JSON.parse(rawValue) : null;
}

function saveLocalProgressSnapshot() {
  localStorage.setItem(localProgressSnapshotKey, localStorage.getItem(progressKey) || 'null');
  localStorage.setItem(localSavingsSnapshotKey, localStorage.getItem(savingsGoalKey) || 'null');
}

function restoreLocalProgressSnapshot() {
  const savedProgress = localStorage.getItem(localProgressSnapshotKey);
  const savedSavings = localStorage.getItem(localSavingsSnapshotKey);
  if (savedProgress === null || savedProgress === 'null') {
    localStorage.removeItem(progressKey);
  } else {
    localStorage.setItem(progressKey, savedProgress);
  }
  if (savedSavings === null || savedSavings === 'null') {
    localStorage.removeItem(savingsGoalKey);
  } else {
    localStorage.setItem(savingsGoalKey, savedSavings);
  }
  window.dispatchEvent(new CustomEvent('moneysmart:progress-loaded', {
    detail: { progress: window.MoneySmart.getProgress(), savingsGoal: parseStoredValue(savingsGoalKey) },
  }));
}

function dispatchLoadedProgress(progress, savingsGoal) {
  localStorage.setItem(progressKey, JSON.stringify(progress));
  if (savingsGoal) {
    localStorage.setItem(savingsGoalKey, JSON.stringify(savingsGoal));
  } else {
    localStorage.removeItem(savingsGoalKey);
  }
  window.dispatchEvent(new CustomEvent('moneysmart:progress-loaded', {
    detail: { progress, savingsGoal },
  }));
}

function userDocument(user) {
  return doc(getFirestore(), 'users', user.uid);
}

async function saveUserData(fields) {
  if (!currentUser || !userDataReady) return false;
  await setDoc(userDocument(currentUser), {
    uid: currentUser.uid,
    email: currentUser.email,
    ...fields,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return true;
}

function setAccountMode(createAccount) {
  accountMode.createAccount = createAccount;
  if (!authForm) return;
  authSubmit.textContent = createAccount ? 'Create account' : 'Sign in';
  modeToggle.textContent = createAccount ? 'Already have an account? Sign in' : 'Need an account? Create one';
  passwordInput.autocomplete = createAccount ? 'new-password' : 'current-password';
  passwordHint.hidden = !createAccount;
}

function renderAccount(user) {
  const isSignedIn = Boolean(user);
  if (authSection) authSection.hidden = isSignedIn;
  if (appHeader) appHeader.hidden = !isSignedIn;
  if (learningContent) learningContent.hidden = !isSignedIn;
  if (learningFooter) learningFooter.hidden = !isSignedIn;
  if (appNavigation) appNavigation.hidden = !isSignedIn;
  if (appNavActions) appNavActions.hidden = !isSignedIn;
  if (!authForm) return;
  authForm.hidden = isSignedIn;
  if (user) {
    passwordInput.value = '';
    setStatus('');
  }
}

async function downloadAccountData() {
  if (!currentUser) {
    throw new Error('Sign in before downloading your account data.');
  }
  const snapshot = await getDoc(userDocument(currentUser));
  if (!snapshot.exists()) {
    throw new Error('No Firestore account data was found to download.');
  }
  const data = snapshot.data();
  const download = {
    uid: currentUser.uid,
    email: currentUser.email,
    downloadedAt: new Date().toISOString(),
    progress: data.progress || {},
    savingsGoal: data.savingsGoal || null,
  };
  const blob = new Blob([JSON.stringify(download, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `moneysmart-${currentUser.uid}-data.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  setStatus('Your account data was downloaded.');
}

const configValues = Object.values(firebaseConfig);
const configIsMissing = configValues.some((value) => !value || value.includes('YOUR_'));

if (configIsMissing) {
  const message = 'Add your Firebase web app settings to firebase-config.js, then reload this page.';
  if (authForm) {
    authForm.querySelectorAll('input, button[type="submit"]').forEach((element) => {
      element.disabled = true;
    });
    setStatus(message, true);
  } else {
    console.error(message);
  }
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getFirestore(app);

  window.MoneySmartFirebase = {
    saveProgress(progress) {
      if (!currentUser) return Promise.resolve('local');
      return saveUserData({ progress, savingsGoal: progress.savingsGoal || null })
        .then((saved) => saved ? 'synced' : 'local')
        .catch((error) => {
          reportCloudError(error);
          return 'failed';
        });
    },
  };

  onAuthStateChanged(auth, async (user) => {
    const stateVersion = ++authStateVersion;
    if (!user) {
      const hadUser = Boolean(currentUser);
      currentUser = null;
      userDataReady = false;
      renderAccount(null);
      if (hadUser) restoreLocalProgressSnapshot();
      return;
    }

    currentUser = user;
    userDataReady = false;
    renderAccount(user);
    try {
      const reference = doc(database, 'users', user.uid);
      const snapshot = await getDoc(reference);
      if (stateVersion !== authStateVersion) return;
      if (snapshot.exists()) {
        const data = snapshot.data();
        const progress = data.progress || window.MoneySmart.getProgress();
        const savingsGoal = data.savingsGoal || progress.savingsGoal || null;
        progress.savingsGoal = savingsGoal;
        dispatchLoadedProgress(progress, savingsGoal);
        await setDoc(reference, {
          uid: user.uid,
          email: user.email,
          progress: window.MoneySmart.getProgress(),
          savingsGoal,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        const progress = window.MoneySmart.getProgress();
        const savingsGoal = parseStoredValue(savingsGoalKey);
        progress.savingsGoal = savingsGoal;
        dispatchLoadedProgress(progress, savingsGoal);
        await setDoc(reference, {
          uid: user.uid,
          email: user.email,
          progress: window.MoneySmart.getProgress(),
          savingsGoal,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      if (stateVersion !== authStateVersion) return;
      userDataReady = true;
      setStatus('');
    } catch (error) {
      if (stateVersion !== authStateVersion) return;
      reportCloudError(error);
    }
  });

  if (authForm) {
    modeToggle.addEventListener('click', () => setAccountMode(!accountMode.createAccount));
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (accountMode.createAccount && (
        password.length < 8
        || !/[A-Z]/.test(password)
        || !/[0-9]/.test(password)
        || !/[^A-Za-z0-9\s]/.test(password)
      )) {
        setStatus('Use at least 8 characters, including an uppercase letter, a number, and a special character.', true);
        return;
      }

      authSubmit.disabled = true;
      setStatus('');
      try {
        if (!currentUser) saveLocalProgressSnapshot();
        if (accountMode.createAccount) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (error) {
        setStatus(getFirebaseErrorMessage(error), true);
      } finally {
        authSubmit.disabled = false;
      }
    });

    document.getElementById('signOutButton').addEventListener('click', async () => {
      try {
        await signOut(auth);
        setStatus('You have signed out.');
      } catch (error) {
        setStatus(getFirebaseErrorMessage(error), true);
      }
    });
    const downloadButton = document.getElementById('downloadAccountData');
    if (downloadButton) {
      downloadButton.addEventListener('click', () => {
        void downloadAccountData().catch((error) => setStatus(getFirebaseErrorMessage(error), true));
      });
    }
  }
}
