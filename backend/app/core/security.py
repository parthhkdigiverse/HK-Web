import hashlib
import hmac
import json
import base64
import time
import os

SECRET_KEY = os.getenv("JWT_SECRET", "hk_digiverse_secure_secret_key_1029384756")

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with a random salt."""
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000
    )
    return f"{salt.hex()}:{pw_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify PBKDF2-HMAC-SHA256 password signature."""
    try:
        salt_hex, hash_hex = hashed.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)
        pw_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            100000
        )
        return hmac.compare_digest(pw_hash, expected_hash)
    except Exception:
        return False

def create_session_token(data: dict, expires_in_seconds: int = 86400) -> str:
    """Create a signed, base64-encoded session token (JWT-like)."""
    payload = {
        **data,
        "exp": int(time.time()) + expires_in_seconds
    }
    payload_bytes = json.dumps(payload).encode("utf-8")
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode("utf-8").rstrip("=")
    
    # Sign token payload using HMAC-SHA256
    sig = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode("utf-8").rstrip("=")
    
    return f"{payload_b64}.{sig_b64}"

def verify_session_token(token: str) -> dict:
    """Verify HMAC signature and expiration of session token."""
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        
        payload_b64, sig_b64 = parts
        
        # Verify signature integrity
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode("utf-8").rstrip("=")
        
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
            
        # Decode and check expiration
        # Add padding back if necessary
        pad_len = 4 - (len(payload_b64) % 4)
        if pad_len < 4:
            payload_b64 += "=" * pad_len
            
        payload_bytes = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        payload = json.loads(payload_bytes.decode("utf-8"))
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None
