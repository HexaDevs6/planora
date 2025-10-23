// src/store/api/firestoreHelpers.js

import { db } from "@/lib/firebaseConfig";
import {
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    doc,
    query,
    where,
} from "firebase/firestore";
import slugify from "slugify";

/**
 * 🔹 Create a new document in a Firestore collection.
 * Automatically generates:
 * - A unique ID (from Firestore)
 * - A `slug` based on the title or name
 * - ISO timestamps for createdAt / updatedAt
 */
export const createDocumentWithId = async (collectionName, data) => {
    try {
        // Step 1: Add a new document — Firestore auto-generates the ID
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date().toISOString(), // ✅ Consistent UTC time
        });

        // Step 2: Generate a slug if the document has a title or name
        const slugField =
            data.title || data.name
                ? slugify(data.title || data.name, {
                      lower: true,
                      strict: true,
                  })
                : null;

        // Step 3: Update the new document with its own ID + slug + updatedAt
        await updateDoc(docRef, {
            id: docRef.id,
            slug: slugField,
            updatedAt: new Date().toISOString(),
        });

        return docRef.id;
    } catch (error) {
        console.error("🔥 Error creating document:", error);
        throw error;
    }
};

/**
 * 🔹 Fetch all documents from a collection.
 * Returns an array of objects including each document’s ID and data.
 */
export const getAllDocs = async (collectionName) => {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("🔥 Error fetching all documents:", error);
        throw error;
    }
};

/**
 * 🔹 Fetch a single document by its Firestore ID.
 */
export const getDocById = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) throw new Error("Document not found");
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error("🔥 Error fetching document by ID:", error);
        throw error;
    }
};

/**
 * 🔹 Fetch a document by its slug (SEO-friendly route).
 * Example usage: getDocBySlug("events", "planora-meetup-2025")
 */
export const getDocBySlug = async (collectionName, slug) => {
    try {
        const q = query(
            collection(db, collectionName),
            where("slug", "==", slug)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) throw new Error("Document not found");

        const docData = snapshot.docs[0];
        return { id: docData.id, ...docData.data() };
    } catch (error) {
        console.error("🔥 Error fetching document by slug:", error);
        throw error;
    }
};

/**
 * 🔹 Update an existing document by its ID.
 * Automatically refreshes the `updatedAt` timestamp.
 */
export const updateDocument = async (collectionName, id, updatedData) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
            ...updatedData,
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch (error) {
        console.error("🔥 Error updating document:", error);
        throw error;
    }
};

/**
 * 🔹 Delete a document by its ID.
 */
export const deleteDocument = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("🔥 Error deleting document:", error);
        throw error;
    }
};
