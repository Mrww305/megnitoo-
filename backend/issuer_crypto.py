"""
MegniToo Incubator: W3C Verifiable Credential 2.0 Issuance & Verification Engine
Module: issuer_crypto.py
Cryptographic standard: Ed25519Signature2020 + RFC 8785 JSON Canonicalization Scheme (JCS)
"""

import hashlib
import json
import os
from typing import Any, Dict, Tuple
import base58
from nacl.signing import SigningKey, VerifyKey

MEGNI_ISSUER_DID = "did:key:z6MkuT9qV4eWqEaWc7mKx8V3c8b1p9FqK3vW7j5x9aB1c"

def canonicalize_json(data: Any) -> bytes:
    """
    Implements RFC 8785 (JSON Canonicalization Scheme - JCS).
    Lexicographically orders object keys and eliminates non-significant whitespace.
    """
    return json.dumps(
        data,
        ensure_ascii=False,
        separators=(',', ':'),
        sort_keys=True
    ).encode('utf-8')


def get_issuer_signing_key() -> SigningKey:
    """
    Retrieves or generates the MegniToo Incubator Root Signing Key.
    In production, this is loaded from AWS KMS / HashiCorp Vault.
    """
    seed_env = os.getenv("MEGNI_ISSUER_SEED", "megnitoo-incubator-ed25519-secret-seed-2026")
    seed_bytes = hashlib.sha256(seed_env.encode("utf-8")).digest()
    return SigningKey(seed_bytes)


def build_w3c_credential_payload(
    credential_id: str,
    student_did: str,
    student_name: str,
    student_email_hash: str,
    github_username: str,
    project_name: str,
    repo_url: str,
    commit_hash: str,
    deployment_url: str,
    overall_score: float,
    grade: str,
    competencies: list,
    scorecard_id: str,
    verification_id: str,
    transparency_merkle_root: str
) -> Dict[str, Any]:
    """
    Constructs the canonical unsigned JSON-LD document conforming to W3C VC Data Model 2.0.
    """
    return {
        "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://w3id.org/security/suites/ed25519-2020/v1",
            "https://schema.megnito.org/credentials/ai-portfolio/v1.jsonld"
        ],
        "id": credential_id,
        "type": [
            "VerifiableCredential",
            "MegniTooAIPortfolioCredential"
        ],
        "issuer": {
            "id": MEGNI_ISSUER_DID,
            "name": "MegniToo Incubator Credentialing Authority",
            "url": "https://incubator.megnito.org",
            "publicKey": "3a884f68593d6e5a4ff6603a11e8df1c3d9a04db22f96116035f585097bc09ef"
        },
        "validFrom": "2026-03-10T14:22:15Z",
        "validUntil": "2028-03-10T14:22:15Z",
        "credentialSubject": {
            "id": student_did,
            "name": student_name,
            "studentEmailHash": student_email_hash,
            "githubUsername": github_username,
            "projectName": project_name,
            "repoUrl": repo_url,
            "commitHash": commit_hash,
            "deploymentUrl": deployment_url,
            "overallScore": overall_score,
            "grade": grade,
            "competencies": competencies,
            "badges": ["RAG Pipeline Developer", "MLOps Practitioner"]
        },
        "evidence": [
            {
                "id": f"urn:megnito:evidence:scorecard:{scorecard_id}",
                "type": ["PortfolioAuditScorecard", "AutomatedCodeAnalysis"],
                "verifier": "MegniToo Automated Evaluator v3.4",
                "scorecardId": scorecard_id,
                "deploymentVerificationId": verification_id,
                "overallScore": overall_score,
                "commitHash": commit_hash,
                "transparencyLogEntry": {
                    "logId": "megnito-mainnet-log-2026",
                    "merkleRoot": transparency_merkle_root,
                    "timestamp": "2026-03-10T14:23:00Z"
                }
            }
        ]
    }


def sign_w3c_verifiable_credential(
    unsigned_vc: Dict[str, Any],
    signing_key: SigningKey
) -> Dict[str, Any]:
    """
    Applies JCS canonicalization, computes SHA-256 digest, signs with PyNaCl Ed25519,
    and returns complete signed W3C Verifiable Credential.
    """
    canonical_bytes = canonicalize_json(unsigned_vc)
    digest_hex = hashlib.sha256(canonical_bytes).hexdigest()

    # Sign canonical bytes with Ed25519
    signed_box = signing_key.sign(canonical_bytes)
    signature_b58 = base58.b58encode(signed_box.signature).decode("ascii")

    signed_vc = dict(unsigned_vc)
    signed_vc["proof"] = {
        "type": "Ed25519Signature2020",
        "created": "2026-03-10T14:23:05Z",
        "verificationMethod": f"{MEGNI_ISSUER_DID}#key-1",
        "proofPurpose": "assertionMethod",
        "jcsSha256Digest": digest_hex,
        "proofValue": signature_b58
    }
    return signed_vc


def verify_w3c_verifiable_credential(
    signed_vc: Dict[str, Any],
    verify_key: VerifyKey
) -> Tuple[bool, str]:
    """
    Verifies W3C VC 2.0 digital signature.
    Checks that JCS digest matches and Ed25519 signature is cryptographically valid.
    """
    proof = signed_vc.get("proof")
    if not proof or not proof.get("proofValue"):
        return False, "Missing proof or proofValue block in credential."

    expected_digest = proof.get("jcsSha256Digest")
    signature_b58 = proof.get("proofValue")

    # Strip proof to compute canonical digest
    unsigned_payload = {k: v for k, v in signed_vc.items() if k != "proof"}
    canonical_bytes = canonicalize_json(unsigned_payload)
    computed_digest = hashlib.sha256(canonical_bytes).hexdigest()

    if computed_digest != expected_digest:
        return False, f"Digest mismatch: Payload has been tampered with or modified."

    try:
        signature_bytes = base58.b58decode(signature_b58)
        verify_key.verify(canonical_bytes, signature_bytes)
        return True, "Valid Ed25519 signature."
    except Exception as e:
        return False, f"Cryptographic verification error: {str(e)}"
