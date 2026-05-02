/**
 * Google Calendar OAuth callback handler
 * Exchanges authorization code for tokens and stores them
 */

import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/google-calendar'
import { saveGoogleToken } from '@/lib/firebase-calendar'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/settings/calendar?error=${error}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/settings/calendar?error=missing_code', request.url)
      )
    }

    // Decode state to get userId and redirectUrl
    let userId: string
    let redirectUrl: string

    try {
      const decodedState = JSON.parse(Buffer.from(state || '', 'base64').toString())
      userId = decodedState.userId
      redirectUrl = decodedState.redirectUrl || '/settings/calendar'
    } catch {
      return NextResponse.redirect(
        new URL('/settings/calendar?error=invalid_state', request.url)
      )
    }

    // Get redirect URI from environment
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_REDIRECT_URI!

    // Exchange code for tokens
    const { accessToken, refreshToken, expiresIn } =
      await exchangeCodeForToken(code, redirectUri)

    // Save tokens to Firebase
    await saveGoogleToken(userId, accessToken, refreshToken || null, expiresIn)

    // Redirect back to settings with success
    return NextResponse.redirect(
      new URL(
        `${redirectUrl}?success=true&connected=calendar`,
        request.url
      )
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL(
        `/settings/calendar?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`,
        request.url
      )
    )
  }
}
