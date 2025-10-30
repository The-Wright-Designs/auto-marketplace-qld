import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/_lib/firebase/firebase-admin";
import { UserSession } from "@/_types/auth-types";

export async function POST(request: NextRequest) {
  try {
    const { sessionCookie } = await request.json();

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify session cookie using Firebase Admin SDK
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // checkRevoked
    );

    // Get additional user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    const user: UserSession = {
      uid: userRecord.uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || undefined,
      emailVerified: userRecord.emailVerified || false,
      customClaims: userRecord.customClaims || {},
      lastSignInTime: new Date(decodedClaims.auth_time * 1000).toISOString(),
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
