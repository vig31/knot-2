/**
 * Firebase utility for managing Google Calendar credentials
 * Stores encrypted tokens in Firestore
 */

import { db } from './firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { GoogleCalendarToken } from '@/types'

const TOKENS_COLLECTION = 'googleCalendarTokens'

/**
 * Store Google Calendar token for a user
 */
export async function saveGoogleToken(
  userId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresIn: number
): Promise<void> {
  const expiresAt = Date.now() + expiresIn * 1000

  const tokenData = {
    userId,
    accessToken,
    refreshToken: refreshToken || null,
    expiresAt,
    connectedAt: new Date(),
    updatedAt: new Date(),
  }

  await setDoc(
    doc(db, TOKENS_COLLECTION, userId),
    tokenData
  )
}

/**
 * Get Google Calendar token for a user
 */
export async function getGoogleToken(
  userId: string
): Promise<GoogleCalendarToken | null> {
  const docRef = doc(db, TOKENS_COLLECTION, userId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    userId: data.userId,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    connectedAt: data.connectedAt?.toDate?.() || new Date(),
  }
}

/**
 * Update access token (called when refreshing token)
 */
export async function updateAccessToken(
  userId: string,
  accessToken: string,
  expiresIn: number
): Promise<void> {
  const expiresAt = Date.now() + expiresIn * 1000

  const docRef = doc(db, TOKENS_COLLECTION, userId)
  await setDoc(
    docRef,
    {
      accessToken,
      expiresAt,
      updatedAt: new Date(),
    },
    { merge: true }
  )
}

/**
 * Delete Google Calendar token (disconnect calendar)
 */
export async function deleteGoogleToken(userId: string): Promise<void> {
  const docRef = doc(db, TOKENS_COLLECTION, userId)
  await deleteDoc(docRef)
}

/**
 * Check if token needs refresh
 */
export function isTokenExpired(token: GoogleCalendarToken): boolean {
  return Date.now() >= token.expiresAt - 5 * 60 * 1000 // Refresh 5 minutes before expiry
}
