/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ActiveCharacter, LegacyState } from './types';

// Web App Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvVpE6IS_BLg3nPHG-98y7MFY1xlJivrQ",
  authDomain: "gen-lang-client-0834829916.firebaseapp.com",
  projectId: "gen-lang-client-0834829916",
  storageBucket: "gen-lang-client-0834829916.firebasestorage.app",
  messagingSenderId: "803246099687",
  appId: "1:803246099687:web:0b16fb5abdd0c18aada642"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
const databaseId = "ai-studio-99c57950-f321-4392-9eb2-35a947103a8d";
export const db = getFirestore(app, databaseId);

export interface CloudSaveData {
  saveId: string;
  passcode: string;
  character: ActiveCharacter | null;
  legacy: LegacyState;
  updatedAt: string;
}

/**
 * Saves game state to the Firestore cloud database
 */
export async function saveToCloud(
  saveId: string,
  passcode: string,
  character: ActiveCharacter | null,
  legacy: LegacyState
): Promise<void> {
  const cleanedSaveId = saveId.trim().toLowerCase();
  if (!cleanedSaveId) {
    throw new Error("Save Code cannot be empty");
  }
  
  const docRef = doc(db, 'saves', cleanedSaveId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const existingData = docSnap.data();
    if (existingData.passcode && existingData.passcode !== passcode) {
      throw new Error("Incorrect passcode for this Save Code!");
    }
  }
  
  const payload: CloudSaveData = {
    saveId: cleanedSaveId,
    passcode,
    character,
    legacy,
    updatedAt: new Date().toISOString()
  };
  
  await setDoc(docRef, payload);
}

/**
 * Loads game state from the Firestore cloud database
 */
export async function loadFromCloud(
  saveId: string,
  passcode: string
): Promise<{ character: ActiveCharacter | null; legacy: LegacyState } | null> {
  const cleanedSaveId = saveId.trim().toLowerCase();
  if (!cleanedSaveId) return null;
  
  const docRef = doc(db, 'saves', cleanedSaveId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as CloudSaveData;
    if (data.passcode !== passcode) {
      throw new Error("Incorrect passcode for this Save Code!");
    }
    return {
      character: data.character,
      legacy: data.legacy
    };
  }
  
  return null;
}

/**
 * Checks if a specific Save Code already exists
 */
export async function checkSaveExists(saveId: string): Promise<boolean> {
  const cleanedSaveId = saveId.trim().toLowerCase();
  if (!cleanedSaveId) return false;
  
  const docRef = doc(db, 'saves', cleanedSaveId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
