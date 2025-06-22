import { db, auth } from './firebaseConfig.js';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const requestsRef = collection(db, "serviceRequests");
const providerId = auth.currentUser?.uid;

// Counter Setup
const pendingQuery = query(requestsRef, where("providerId", "==", providerId), where("status", "==", "pending"));
const completedQuery = query(requestsRef, where("providerId", "==", providerId), where("status", "==", "completed"));

onSnapshot(pendingQuery, snapshot => {
  document.getElementById("pending-count").textContent = snapshot.size;
});

onSnapshot(completedQuery, snapshot => {
  document.getElementById("completed-count").textContent = snapshot.size;
});

// Handling Accept/Deny
function handleAccept(requestId) {
  updateDoc(doc(db, "serviceRequests", requestId), { status: "pending" });
}

function handleDeny(requestId) {
  deleteDoc(doc(db, "serviceRequests", requestId));
}

function markAsDone(requestId, isProvider) {
  const updateField = isProvider ? "providerDone" : "userDone";
  updateDoc(doc(db, "serviceRequests", requestId), { [updateField]: true });
}

// Monitor job completion
function watchJobCompletion(requestId) {
  onSnapshot(doc(db, "serviceRequests", requestId), (docSnap) => {
    const data = docSnap.data();
    if (data.userDone && data.providerDone) {
      updateDoc(doc(db, "serviceRequests", requestId), { status: "completed" });
    }
  });
}

export { handleAccept, handleDeny, markAsDone, watchJobCompletion };