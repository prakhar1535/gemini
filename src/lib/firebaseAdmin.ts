import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");

// Fix PEM formatting
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

// Initialize Firebase Admin only once
if (!getApps().length && Object.keys(serviceAccount).length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();
