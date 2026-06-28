import hashlib
import base64
from django.contrib.auth.hashers import BasePasswordHasher
from django.utils.crypto import constant_time_compare

class LegacySHA256Hasher(BasePasswordHasher):
    algorithm = "legacy_sha256"
    salt = "GlobalHRMSalt"

    def encode(self, password, salt):
        # Mirroring C# HashPassword: Base64(SHA256(password + "GlobalHRMSalt"))
        sha256 = hashlib.sha256()
        combined = password + self.salt
        sha256.update(combined.encode('utf-8'))
        hashed_bytes = sha256.digest()
        encoded = base64.b64encode(hashed_bytes).decode('utf-8')
        return f"{self.algorithm}${encoded}"

    def verify(self, password, encoded):
        # Support both prefixed and non-prefixed (raw base64) verification
        if '$' in encoded:
            algorithm, hash_val = encoded.split('$', 1)
            assert algorithm == self.algorithm
        else:
            hash_val = encoded
        
        encoded_new = self.encode(password, self.salt)
        _, new_hash_val = encoded_new.split('$', 1)
        return constant_time_compare(hash_val, new_hash_val)

    def safe_summary(self, encoded):
        if '$' in encoded:
            algorithm, hash_val = encoded.split('$', 1)
        else:
            algorithm = self.algorithm
            hash_val = encoded
        return {
            'algorithm': algorithm,
            'hash': hash_val,
        }
