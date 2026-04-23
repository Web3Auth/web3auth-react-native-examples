import firebaseAuth from "@react-native-firebase/auth";

// IMP START - Auth Provider Login
/**
 * Signs in to Firebase anonymously and returns the user's ID token.
 *
 * In a real app, replace `signInAnonymously()` with the Firebase auth method
 * that matches your use-case (e.g. signInWithEmailAndPassword, Google sign-in,
 * phone number, etc.).  The ID token is the JWT you hand to Web3Auth.
 */
export async function getFirebaseIdToken(): Promise<string> {
  const result = await firebaseAuth().signInAnonymously();
  // Force-refresh to get the latest token (iat claim within 60 s of current time)
  const idToken = await result.user.getIdToken(true);
  return idToken;
}
// IMP END - Auth Provider Login
