import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

class RSAService:
    """
    Service class for RSA cryptographic operations
    """
    
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self.key_size = None
    
    def generate_key_pair(self, key_size=2048):
        """
        Generate a new RSA key pair with the specified key size
        
        Args:
            key_size (int): Size of the key in bits (1024 or 2048)
            
        Returns:
            dict: Dictionary containing the encoded public and private keys
        """
        if key_size not in [1024, 2048]:
            raise ValueError("Key size must be either 1024 or 2048 bits")
            
        self.key_size = key_size
        
        # Generate private key
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=key_size
        )
        
        # Extract public key
        self.public_key = self.private_key.public_key()
        
        # Serialize keys to PEM format
        private_pem = self.private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')
        
        public_pem = self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        
        return {
            'private_key': private_pem,
            'public_key': public_pem,
            'key_size': key_size
        }
    
    def load_keys(self, public_key_pem=None, private_key_pem=None):
        """
        Load existing RSA keys from PEM format
        
        Args:
            public_key_pem (str): Public key in PEM format
            private_key_pem (str): Private key in PEM format
        """
        if public_key_pem:
            self.public_key = serialization.load_pem_public_key(
                public_key_pem.encode('utf-8')
            )
            
        if private_key_pem:
            self.private_key = serialization.load_pem_private_key(
                private_key_pem.encode('utf-8'),
                password=None
            )
    
    def encrypt(self, plaintext, public_key_pem=None):
        """
        Encrypt a message using RSA public key
        
        Args:
            plaintext (str): The message to encrypt
            public_key_pem (str, optional): Public key in PEM format. If not provided, uses the instance public key.
            
        Returns:
            str: Base64 encoded encrypted message with chunks separated by '|'
        """
        if public_key_pem:
            self.load_keys(public_key_pem=public_key_pem)
            
        if not self.public_key:
            raise ValueError("Public key is not available")
        
        # Split text into chunks of 120 or 60 characters (RSA has size limits)
        max_chunk_size = 190
        if self.key_size == 1024:
            max_chunk_size = 62
        
        plaintext_bytes = plaintext.encode('utf-8')
        
        # Split text into chunks based on byte size
        chunks = []
        for i in range(0, len(plaintext_bytes), max_chunk_size):
            chunks.append(plaintext_bytes[i:i + max_chunk_size])


        encrypted_chunks = []
        for chunk in chunks:
            ciphertext = self.public_key.encrypt(
                chunk,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            encrypted_chunks.append(base64.b64encode(ciphertext).decode('utf-8'))
        
        # Join encrypted chunks with '|' delimiter
        return '|'.join(encrypted_chunks)
    
    def decrypt(self, ciphertext_b64, private_key_pem=None):
        """
        Decrypt a message using RSA private key
        
        Args:
            ciphertext_b64 (str): Base64 encoded encrypted message with chunks separated by '|'
            private_key_pem (str, optional): Private key in PEM format. If not provided, uses the instance private key.
            
        Returns:
            str: Decrypted message
        """
        if private_key_pem:
            self.load_keys(private_key_pem=private_key_pem)
            
        if not self.private_key:
            raise ValueError("Private key is not available")
        
        # Split the ciphertext into chunks
        encrypted_chunks = ciphertext_b64.split('|')

        decrypted_chunks = []
        for chunk in encrypted_chunks:
            ciphertext = base64.b64decode(chunk)
            plaintext = self.private_key.decrypt(
                ciphertext,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            decrypted_chunks.append(plaintext)
        
        # Combine the decrypted chunks
        combined_bytes = b''.join(decrypted_chunks)
        return combined_bytes.decode('utf-8')