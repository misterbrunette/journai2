import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, getDocs, query, orderBy, doc } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1PqjsmOknKl2ZuRUORLG-4faiYFiuKA0",
  authDomain: "journai-6b1fe.firebaseapp.com",
  databaseURL: "https://journai-6b1fe-default-rtdb.firebaseio.com",
  projectId: "journai-6b1fe",
  storageBucket: "journai-6b1fe.appspot.com",
  messagingSenderId: "13426463829",
  appId: "1:13426463829:web:fdf1588552513c567f70dc",
  measurementId: "G-60CFJTY6S0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = firebase.firestore();

// Function to display journal entries in a table
function displayJournalEntries(journalEntries) {
  const table = document.getElementById('journal-entries-table');

  // Remove any existing rows from the table
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  // Add headers to the table
  const header = table.createTHead();
  const row = header.insertRow();
  const titleHeader = row.insertCell();
  const contentHeader = row.insertCell();
  const actionsHeader = row.insertCell();
  titleHeader.textContent = 'Title';
  contentHeader.textContent = 'Content';
  actionsHeader.textContent = 'Actions';

  // Add each journal entry to the table
  journalEntries.forEach((entry) => {
    const row = table.insertRow();
    const titleCell = row.insertCell();
    const contentCell = row.insertCell();
    const actionsCell = row.insertCell();
    titleCell.textContent = entry.title;
    contentCell.textContent = entry.content;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteJournalEntry(entry.id);
    });
    actionsCell.appendChild(deleteButton);
  });
}
// Function to add a journal entry to the server
async function addJournalEntryToServer(journalEntry) {
  try {
    const userId = auth.currentUser.uid;
    const docRef = await addDoc(collection(db, 'users', userId, 'journalEntries'), {
      title: journalEntry.title,
      content: journalEntry.content,
      createdAt: serverTimestamp()
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

// Function to display journal entries in a table
 function displayJournalEntries(journalEntries) {
   const table = document.getElementById('journal-entries-table');

   // Remove any existing rows from the table
   while (table.rows.length > 0) {
     table.deleteRow(0);
   }

   // Add headers to the table
   const header = table.createTHead();
   const row = header.insertRow();
   const titleHeader = row.insertCell();
   const contentHeader = row.insertCell();
   const actionsHeader = row.insertCell();
   titleHeader.textContent = 'Title';
   contentHeader.textContent = 'Content';
   actionsHeader.textContent = 'Actions';

   // Add each journal entry to the table
   journalEntries.forEach((entry) => {
     const row = table.insertRow();
     const titleCell = row.insertCell();
     const contentCell = row.insertCell();
     const actionsCell = row.insertCell();
     titleCell.textContent = entry.title;
     contentCell.textContent = entry.content;
     const deleteButton = document.createElement('button');
     deleteButton.textContent = 'Delete';
     deleteButton.addEventListener('click', () => {
       deleteJournalEntry(entry.id);
     });
     actionsCell.appendChild(deleteButton);
   });
 }

 // Function to add a journal entry to the server
  async function addJournalEntry(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const createdAt = new Date().toISOString();

   const journalEntry = {
     title,
     content,
     createdAt,
   };

   const userId = auth.currentUser.uid;
   const docRef = await addDoc(
     collection(db, 'users', userId, 'journalEntries'),
     journalEntry
   );
   console.log('Document written with ID: ', docRef.id);

   // Clear form fields and disable save button
   document.getElementById('title').value = '';
   document.getElementById('content').value = '';
   saveButton.disabled = true;

   // Refresh journal entries table
   displayJournalEntries();
 }

 // Function to request feedback on a journal entry
 async function requestFeedback() {
   const selectedEntryId = document.getElementById('journal-entries').value;
   if (!selectedEntryId) {
     return;
   }

   const userId = auth.currentUser.uid;
   const journalEntryRef = doc(db, 'users', userId, 'journalEntries', selectedEntryId);
   const journalEntryDoc = await getDoc(journalEntryRef);

   if (journalEntryDoc.exists()) {
     const journalEntry = journalEntryDoc.data();
     const response = await fetch(apiUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${openaiApiKey}`,
       },
       body: JSON.stringify({
         prompt: `Analyze the following journal entry: "${journalEntry.title} - ${journalEntry.content}"`,
         temperature: 0.5,
         max_tokens: 60,
       }),
     });

     if (response.ok) {
       const { choices } = await response.json();
       const feedback = choices[0].text.trim();
       feedbackText.textContent = feedback;
     } else {
       feedbackText.textContent = 'Error: Failed to request feedback.';
     }
   } else {
     console.error('Journal entry document does not exist.');
   }
 }

 // Function to update the user banner with the current user's email
 function updateUserBanner() {
   if (auth.currentUser) {
     userBanner.style.display = 'block';
     userEmail.innerText = auth.currentUser.email;
   } else {
     userBanner.style.display = 'none';
   }
 }

 // Function to sign up a user
 async function signUp(e) {
   e.preventDefault();
   const email = signUpEmail.value;
   const password = signUpPassword.value;

   try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     console.log('Signed up user: ', userCredential.user.uid);
     signUpModal.style.display = 'none';
   } catch (error) {
     console.error('Error signing up: ', error);
     signUpError.textContent = error.message;
   }
 }
 // Function to sign in a user
 async function signIn(event) {
   event.preventDefault();
   const email = document.getElementById('sign-in-email').value;
   const password = document.getElementById('sign-in-password').value;
 
   try {
     const userCredential = await signInWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;
 
     // Close the sign in modal and clear the form
     closeSignIn();
     document.getElementById('sign-in-form').reset();
 
     // Update the user banner with the user's email
     updateBanner(user.email);
 
     // Display the journal form and entries table
     journalForm.classList.remove('hidden');
     displayJournalEntries();
   } catch (error) {
     const errorCode = error.code;
     const errorMessage = error.message;
     console.error(`Failed to sign in user: ${errorCode} ${errorMessage}`);
     document.getElementById('auth-error').textContent = errorMessage;
   }
 }
 
 // Function to sign up a new user
 async function signUp(event) {
   event.preventDefault();
   const email = document.getElementById('sign-up-email').value;
   const password = document.getElementById('sign-up-password').value;
 
   try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;
 
     // Close the sign up modal and clear the form
     closeSignUp();
     document.getElementById('sign-up-form').reset();
 
     // Update the user banner with the user's email
     updateBanner(user.email);
 
     // Display the journal form and entries table
     journalForm.classList.remove('hidden');
     displayJournalEntries();
   } catch (error) {
     const errorCode = error.code;
     const errorMessage = error.message;
     console.error(`Failed to sign up user: ${errorCode} ${errorMessage}`);
     document.getElementById('auth-error').textContent = errorMessage;
   }
 }
 
 // Function to sign out the current user
 async function signOut() {
   try {
     await signOut(auth);
 
     // Update the user banner to indicate no user is signed in
     updateBanner('');
 
     // Hide the journal form and entries table
     journalForm.classList.add('hidden');
     const table = document.getElementById('journal-entries-table');
     while (table.rows.length > 1) {
       table.deleteRow(1);
     }
   } catch (error) {
     console.error('Failed to sign out user: ', error);
   }
 }
 
 // Function to update the user banner with the current user's email
 function updateBanner(email) {
   if (email) {
     // Show the banner with the user's email and sign out button
     userBanner.classList.remove('hidden');
     userEmail.innerText = email;
     signOutButton.addEventListener('click', signOut);
   } else {
     // Hide the banner and remove the sign out button event listener
     userBanner.classList.add('hidden');
     userEmail.innerText = '';
     signOutButton.removeEventListener('click', signOut);
   }
 }
 // Function to add a journal entry to the server
 async function addJournalEntry(journalEntry) {
  // Add the journal entry to the Firestore database
  db.collection("journalEntries").add(entry)
    .then(function(docRef) {
      console.log("Journal entry saved with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding journal entry: ", error);
    });
}
   try {
     const userId = auth.currentUser.uid;
     const docRef = await addDoc(collection(db, 'users', userId, 'journalEntries'), {
       title: journalEntry.title,
       content: journalEntry.content,
       createdAt: serverTimestamp()
     });
     console.log('Document written with ID: ', docRef.id);
   } catch (error) {
     console.error('Error adding document: ', error);
   }
 }
 
 // Function to display journal entries in a table
 async function displayJournalEntries() {
   const table = document.getElementById('journal-entries-table');
 
   // Remove any existing rows from the table
   while (table.rows.length > 1) {
     table.deleteRow(1);
   }
 
   try {
     const userId = auth.currentUser.uid;
     const querySnapshot = await getDocs(
       query(collection(db, 'users', userId, 'journalEntries'), orderBy('createdAt', 'desc'))
     );
 
     querySnapshot.forEach((doc) => {
       const data = doc.data();
       const row = table.insertRow(1);
       const titleCell = row.insertCell(0);
       const contentCell = row.insertCell(1);
       const dateCell = row.insertCell(2);
 
       titleCell.innerText = data.title;
       contentCell.innerText = data.content;
       dateCell.innerText = new Date(data.createdAt.toMillis()).toLocaleString();
     });
   } catch (error) {
     console.error('Error getting documents: ', error);
   }
 }
 
 // Function to request feedback for a journal entry
 async function requestFeedback() {
   const feedbackText = document.getElementById('feedback-text');
   feedbackText.innerText = 'Loading...';
 
   const journalEntriesSelect = document.getElementById('journal-entries');
   const selectedEntryId = journalEntriesSelect.value;
 
   try {
     const userId = auth.currentUser.uid;
     const journalEntryDocRef = doc(db, 'users', userId, 'journalEntries', selectedEntryId);
     const journalEntryDoc = await getDoc(journalEntryDocRef);
 
     if (journalEntryDoc.exists()) {
       const journalEntryData = journalEntryDoc.data();
       const feedback = await generateFeedback(journalEntryData.title, journalEntryData.content);
       feedbackText.innerText = feedback;
     } else {
       console.error('Journal entry document does not exist.');
     }
   } catch (error) {
     console.error('Error requesting feedback: ', error);
     feedbackText.innerText = 'Error requesting feedback. Please try again later.';
   }
 }
 
 // Function to generate feedback for a journal entry using OpenAI's GPT-3 API
async function generateFeedback(title, content) {
  try {
    const response = await fetch('/generate-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, content: content })
    });

    const data = await response.json();
    return data.feedback;
  } catch (error) {
    console.error('Error generating feedback: ', error);
    return 'Error generating feedback. Please try again later.';
  }
}

// Function to request feedback for a journal entry
async function requestFeedback() {
  const selectedEntryId = document.getElementById('journal-entries').value;
  if (!selectedEntryId) {
    return;
  }

  const userId = auth.currentUser.uid;
  const journalEntryRef = doc(db, 'users', userId, 'journalEntries', selectedEntryId);
  const journalEntryDoc = await getDoc(journalEntryRef);

  if (journalEntryDoc.exists()) {
    const journalEntry = journalEntryDoc.data();
    const feedback = await generateFeedback(journalEntry.title, journalEntry.content);
    const feedbackText = document.getElementById('feedback-text');
    feedbackText.textContent = feedback;
  } else {
    console.error('Journal entry document does not exist.');
  }
}

// Function to update the user banner with the current user's email
function updateUserBanner() {
  const user = auth.currentUser;
  const userBanner = document.getElementById('user-banner');
  const userEmail = document.getElementById('user-email');
  if (user) {
    userBanner.style.display = 'block';
    userEmail.innerText = user.email;
  } else {
    userBanner.style.display = 'none';
  }
}

// Function to sign up a user
async function signUp(event) {
  event.preventDefault();

  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('sign-up-password').value;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Sign up successful!');
    console.log(user);
    closeSignUpModal();
  } catch (error) {
    console.error('Error signing up: ', error);
  }
}

// Function to sign in a user
async function signIn(event) {
  event.preventDefault();

  const email = document.getElementById('sign-in-email').value;
  const password = document.getElementById('sign-in-password').value;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful!');
    console.log(user);
    closeSignInModal();
  } catch (error) {
    console.error('Error signing in: ', error);
  }
}

// Function to sign out the current user
async function signOut() {
  try {
    await signOut(auth);
    console.log('Sign out successful!');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
}

// Function to open the sign in modal
function openSignInModal() {
  signInModal.style.display = 'block';
}

// Function to close the sign in modal
function closeSignInModal() {
  signInModal.style.display = 'none';
}

// Function to open the sign up modal
function openSignUpModal() {
  signUpModal.style.display = 'block';
}

// Function to close the sign up modal
function closeSignUpModal() {
  signUpModal.style.display = 'none';
}

// Function to add a journal entry to the server
async function addJournalEntry(event) {
  event.preventDefault();

// Add event listeners to buttons
document.getElementById('save-button').addEventListener('click', saveJournalEntry);
document.getElementById('request-feedback').addEventListener('click', requestFeedback);
document.getElementById('sign-in-link').addEventListener('click', openSignInModal);
document.getElementById('sign-up-link').addEventListener('click', openSignUpModal);
document.getElementById('sign-in-form').addEventListener('submit', signIn);
document.getElementById('sign-up-form').addEventListener('submit', signUp);
document.getElementById('sign-out-link').addEventListener('click', signOut);
// Get the sign in and sign up modals
const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');

// Get the sign in and sign up links
const signInLink = document.getElementById('sign-in-link');
const signUpLink = document.getElementById('sign-up-link');

// Add event listeners to sign in and sign up links
signInLink.addEventListener('click', () => {
  signInModal.style.display = 'block';
});

signUpLink.addEventListener('click', () => {
  signUpModal.style.display = 'block';
});

// Add event listener to close button in modals
document.querySelectorAll('.close').forEach((closeButton) => {
  closeButton.addEventListener('click', () => {
    signInModal.style.display = 'none';
    signUpModal.style.display = 'none';
  });
});

// Add event listener to window to close modals when clicking outside of them
window.addEventListener('click', (event) => {
  if (event.target === signInModal) {
    signInModal.style.display = 'none';
  }
  if (event.target === signUpModal) {
    signUpModal.style.display = 'none';
  }
});

// Initialize the app
initApp();
