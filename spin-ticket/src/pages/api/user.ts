import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const COLLECTION_NAME = "uuid";

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let firebaseApp;

  // Check if required environment variables are defined
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    throw new Error("Missing Firebase environment variables.");
  }

  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    firebaseApp = admin.app();
  }

  const db = admin.firestore();

  try {
    const documentId = req.query.documentId;

    if (!documentId) {
      return res.status(400).json({ error: "Missing documentId parameter" });
    }

    const docRef = db.collection(COLLECTION_NAME).doc(documentId.toString());
    const doc = await docRef.get();

    if (doc.exists) {
      res.status(200).json({ id: doc.id, ...doc.data() });
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Error fetching document" });
  }
}
