import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { NextResponse } from "next/server";
import { firebaseApp } from "@/_lib/firebase/firebase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Testing password authentication for:", email);

    const auth = getAuth(firebaseApp);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return NextResponse.json({
      success: true,
      message: "Password authentication successful",
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      lastSignInTime: userCredential.user.metadata.lastSignInTime,
      creationTime: userCredential.user.metadata.creationTime
    });

  } catch (error: unknown) {
    console.error("Password verification error:", error);

    let errorMessage = "Unknown error";
    let errorCode = "unknown";

    if (error instanceof Error) {
      errorMessage = error.message;
      const firebaseError = error as { code?: string };
      errorCode = firebaseError.code || "unknown";
    }

    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
        message: errorMessage,
        errorCode: errorCode
      },
      { status: 401 }
    );
  }
}