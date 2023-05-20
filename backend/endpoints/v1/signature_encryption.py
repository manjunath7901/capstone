from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.backends import default_backend
import base64, os

def encrypt_signature(data, public_key_path="public_key.pem"):
    with open(public_key_path, "rb") as key_file:
        public_key = serialization.load_pem_public_key(
            key_file.read(),
            backend=default_backend()
        )
    
    encrypted_data = public_key.encrypt(
        data.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Encode the encrypted data as Base64 string
    encrypted_data = base64.b64encode(encrypted_data).decode("utf-8")
    
    return encrypted_data