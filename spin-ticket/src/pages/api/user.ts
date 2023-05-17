import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";

const serviceAccount = require("../../../firebase.json"); // 秘密鍵を取得

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const COLLECTION_NAME = "uuid";

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
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
