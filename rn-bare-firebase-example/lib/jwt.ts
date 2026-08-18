/** Decode a JWT payload without verifying the signature (debug / preflight only). */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split(".");
  if (!payload) {
    throw new Error("Invalid JWT format");
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = globalThis.atob
    ? globalThis.atob(normalized)
    : Buffer.from(normalized, "base64").toString("utf8");

  return JSON.parse(json) as Record<string, unknown>;
}

/** Firebase project ID bundled with this example app. */
export const EXPECTED_FIREBASE_PROJECT_ID = "web3auth-oauth-logins";

export function getFirebaseJwtDiagnostics(idToken: string) {
  const claims = decodeJwtPayload(idToken);
  const aud = String(claims.aud ?? "");
  const iss = String(claims.iss ?? "");
  const sub = String(claims.sub ?? "");
  const userId = String(claims.user_id ?? "");

  const expectedIss = `https://securetoken.google.com/${EXPECTED_FIREBASE_PROJECT_ID}`;
  const issues: string[] = [];

  if (aud !== EXPECTED_FIREBASE_PROJECT_ID) {
    issues.push(`JWT aud is "${aud}" but dashboard must validate aud="${EXPECTED_FIREBASE_PROJECT_ID}"`);
  }
  if (iss !== expectedIss) {
    issues.push(`JWT iss is "${iss}" but dashboard must validate iss="${expectedIss}"`);
  }
  if (!sub) {
    issues.push('JWT is missing "sub"');
  }
  if (!userId) {
    issues.push('JWT is missing "user_id" (required by the React Native SDK SFA path)');
  }

  return {
    aud,
    iss,
    sub,
    userId,
    issues,
  };
}
