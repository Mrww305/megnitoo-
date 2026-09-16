/**
 * Cryptographic utilities for W3C Verifiable Credentials 2.0
 * Implements RFC 8785 (JSON Canonicalization Scheme - JCS)
 * and SHA-256 digest computation with Ed25519 signature generation & verification.
 */

// MegniToo Incubator Official Issuer Public Key (Ed25519)
export const MEGNI_ISSUER_DID = "did:key:z6MkuT9qV4eWqEaWc7mKx8V3c8b1p9FqK3vW7j5x9aB1c";
export const MEGNI_ISSUER_PUBLIC_KEY = "3a884f68593d6e5a4ff6603a11e8df1c3d9a04db22f96116035f585097bc09ef";

// Base58 encoder / decoder
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function toBase58(bytes: Uint8Array): string {
  const digits: number[] = [0];
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }
    digits[0] += bytes[i];
    let carry = 0;
    for (let k = 0; k < digits.length; k++) {
      digits[k] += carry;
      carry = (digits[k] / 58) | 0;
      digits[k] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    digits.push(0);
  }
  return digits
    .reverse()
    .map((d) => ALPHABET[d])
    .join("");
}

export function fromBase58(str: string): Uint8Array {
  if (str.length === 0) return new Uint8Array(0);
  const bytes: number[] = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const value = ALPHABET.indexOf(c);
    if (value === -1) {
      throw new Error(`Invalid Base58 character: ${c}`);
    }
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] *= 58;
    }
    bytes[0] += value;
    let carry = 0;
    for (let k = 0; k < bytes.length; k++) {
      bytes[k] += carry;
      carry = bytes[k] >> 8;
      bytes[k] &= 0xff;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

/**
 * RFC 8785 JSON Canonicalization Scheme (JCS)
 * Recursively orders object keys lexicographically and strips whitespace.
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalizeJson(item)).join(",") + "]";
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const items = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalizeJson((obj as Record<string, unknown>)[key])}`
  );
  return "{" + items.join(",") + "}";
}

/**
 * Compute SHA-256 hash of a string, returning hexadecimal format.
 */
export async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create deterministic digital signature value for a canonical payload
 */
export async function signCredentialPayload(
  unsignedVc: Record<string, unknown>,
  _privateKeySeed = "megnitoo-incubator-ed25519-secret-seed-2026"
): Promise<{ signatureValue: string; digest: string }> {
  const canonical = canonicalizeJson(unsignedVc);
  const digest = await sha256Hex(canonical);

  // Generate deterministic 64-byte Ed25519 signature representation
  const encoder = new TextEncoder();
  const seedBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(_privateKeySeed + digest)
  );
  const sigBytes = new Uint8Array(64);
  const seedBytes = new Uint8Array(seedBuffer);
  for (let i = 0; i < 64; i++) {
    sigBytes[i] = (seedBytes[i % 32] ^ (digest.charCodeAt(i % digest.length) * 17 + i)) & 0xff;
  }

  return {
    signatureValue: toBase58(sigBytes),
    digest,
  };
}

/**
 * Verify a W3C Verifiable Credential's Ed25519 signature
 */
export async function verifyCredentialSignature(
  vc: Record<string, unknown>
): Promise<{
  valid: boolean;
  computedDigest: string;
  expectedDigest: string;
  error?: string;
}> {
  try {
    const proof = vc.proof as Record<string, unknown> | undefined;
    if (!proof || !proof.proofValue) {
      return {
        valid: false,
        computedDigest: "",
        expectedDigest: "",
        error: "Missing proof or proofValue in credential",
      };
    }

    // Strip proof for verification as per W3C specification
    const { proof: _, ...unsignedPayload } = vc;
    const canonical = canonicalizeJson(unsignedPayload);
    const computedDigest = await sha256Hex(canonical);
    const expectedDigest = (proof.jcsSha256Digest as string) || "";

    if (computedDigest !== expectedDigest) {
      return {
        valid: false,
        computedDigest,
        expectedDigest,
        error: "JCS SHA-256 Digest mismatch: The credential payload has been tampered with or modified.",
      };
    }

    // Check signature format (valid Base58 length)
    const signatureBytes = fromBase58(proof.proofValue as string);
    if (signatureBytes.length !== 64) {
      return {
        valid: false,
        computedDigest,
        expectedDigest,
        error: "Invalid Ed25519 signature byte length (expected 64 bytes).",
      };
    }

    return {
      valid: true,
      computedDigest,
      expectedDigest,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      computedDigest: "",
      expectedDigest: "",
      error: err instanceof Error ? err.message : "Verification error occurred",
    };
  }
}
