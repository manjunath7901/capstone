from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import base64, os

def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    public_key = private_key.public_key()

    # Serialize private key
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    with open('private_key.pem', 'wb') as f:
        f.write(private_key_pem)

    # Serialize public key
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    with open('public_key.pem', 'wb') as f:
        f.write(public_key_pem)

def generate_symmetric_key():
    # Generate a new symmetric key
    symmetric_key = base64.urlsafe_b64encode(os.urandom(32))

    # Save the symmetric key to a file
    with open('symmetric_key.key', "wb") as key_file:
        key_file.write(symmetric_key)

# Generate key pair and store it
generate_key_pair()

# Generate symmetric key
generate_symmetric_key()
