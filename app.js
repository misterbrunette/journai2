// Import Firebase modules
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

// DOM elements
const signInLink = document.querySelector('#sign-in-link');
const signUpLink = document.querySelector('#sign-up-link');
const signInModal = document.querySelector('#sign-in-modal');
const signUpModal = document.querySelector('#sign-up-modal');
const signInForm = document.querySelector('#sign-in-form');
const signUpForm = document.querySelector('#sign-up-form');
const signInClose = document.querySelector('#sign-in-modal .close');
const signUpClose = document.querySelector('#sign-up-modal .close');
const signOutLink = document.querySelector('#sign-out-link');
const userBanner = document.querySelector('#user-banner');
const userEmailDisplay = document.querySelector('#user-email');
const signOutButton = document.querySelector('#sign-out');

// Show sign in modal
signInLink.addEventListener('click', () => {
  signInModal.style.display = 'block';
});

// Show sign up modal
signUpLink.addEventListener('click', () => {
  signUpModal.style.display = 'block';
});

// Close sign in modal
signInClose.addEventListener('click', () => {
  signInModal.style.display = 'none';
});

// Close sign up modal
signUpClose.addEventListener('click', () => {
  signUpModal.style.display = 'none';
});

// Sign up
signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = signUpForm['sign-up-email'].value;
  const password = signUpForm['sign-up-password'].value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    signUpModal.style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
});

// Sign in
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = signInForm['sign-in-email'].value;
  const password = signInForm['sign-in-password'].value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    signInModal.style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
});

// Sign out
signOutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
});

// Update UI based on authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    userBanner.style.display = 'block';
    signInLink.style.display = 'none';
    signUpLink.style.display = 'none';
    signOutLink.style.display = 'block';
    userEmailDisplay.textContent = user.email;
  } else {
    userBanner.style.display = 'none';
    signInLink.style.display = 'block';
    signUpLink.style.display = 'block';
    signOutLink.style.display = 'none';
  }
});

// Show Sign In Modal
signInLink.addEventListener('click', () => {
  signInModal.style.display = 'block';
});

// Show Sign Up Modal
signUpLink.addEventListener('click', () => {
  signUpModal.style.display = 'block';
});

// Close Sign In Modal
signInClose.addEventListener('click', () => {
  signInModal.style.display = 'none';
});

// Close Sign Up Modal
signUpClose.addEventListener('click', () => {
  signUpModal.style.display = 'none';
});

// User Sign Up
signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signUpForm['sign-up-email'].value;
  const password = signUpForm['sign-up-password'].value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    signUpModal.style.display = 'none';
    signUpForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

// User Sign In
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signInForm['sign-in-email'].value;
  const password = signInForm['sign-in-password'].value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    signInModal.style.display = 'none';
    signInForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

// User Sign Out
signOutLink.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error.message);
  }
});

// Update UI based on user auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userEmail.textContent = user.email;
    userBanner.style.display = 'block';
    signOutLink.style.display = 'block';
    signInLink.style.display = 'none';
    signUpLink.style.display = 'none';
    loadJournalEntries(user.uid);
  } else {
    // User is signed out
    userEmail.textContent = '';
    userBanner.style.display = 'none';
    signOutLink.style.display = 'none';
    signInLink.style.display = 'block';
    signUpLink.style.display = 'block';
  }
});

// Save journal entry
journalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = journalForm['title'].value;
  const content = journalForm['content'].value;
  const user = auth.currentUser;

  if (user) {
    try {
      await addDoc(collection(db, 'users', user.uid, 'entries'), {
        title,
        content,
        timestamp: new Date(),
      });
      journalForm.reset();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
});

// Load journal entries
async function loadJournalEntries(uid) {
  const entriesRef = collection(db, 'users', uid, 'entries');
  const q = query(entriesRef, orderBy('timestamp', 'desc'));
  onSnapshot(q, (querySnapshot) => {
    journalEntriesTable.innerHTML = '';
    journalEntriesSelect.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      const entryId = doc.id;

      const row = document.createElement('tr');
      const titleCell = document.createElement('td');
      const contentCell = document.createElement('td');
      titleCell.textContent = entry.title;
      contentCell.textContent = entry.content;
      row.appendChild(titleCell);
      row.appendChild(contentCell);
      journalEntriesTable.appendChild(row);

      const option = document.createElement('option');
      option.value = entryId;
      option.textContent = entry.title;
      journalEntriesSelect.appendChild(option);
    });
  });
}

// Request feedback from ChatGPT
requestFeedbackButton.addEventListener('click', async () => {
  const entryId = journalEntriesSelect.value;
  const user = auth.currentUser;

  if (user && entryId) {
    try {
      const entryDoc = await getDoc(doc(db, 'users', user.uid, 'entries', entryId));
      const entry = entryDoc.data();

      // Replace 'YOUR_API_KEY' with your actual OpenAI API key
      const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
          prompt: `Please provide feedback on the following journal entry:\nTitle: ${entry.title}\nContent: ${entry.content}\n\nFeedback: `,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const feedback = data.choices[0].text.trim();
      feedbackText.textContent = feedback;
    } catch (error) {
      console.error('Error requesting feedback:', error);
    }
  }
};

