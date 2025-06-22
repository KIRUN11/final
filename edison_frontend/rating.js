import { db, auth } from './firebaseConfig.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

async function submitRating(providerId, rating, serviceRequestId) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "ratings"), {
    providerId,
    userId: user.uid,
    rating,
    serviceRequestId,
    createdAt: new Date()
  });
}

async function getAverageRating(providerId) {
  const q = query(collection(db, "ratings"), where("providerId", "==", providerId));
  const snapshot = await getDocs(q);

  let sum = 0;
  snapshot.forEach(doc => sum += doc.data().rating);

  return snapshot.size > 0 ? (sum / snapshot.size).toFixed(1) : "N/A";
}

export { submitRating, getAverageRating };

