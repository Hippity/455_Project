import os,sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
import pytest
import base64
from unittest.mock import patch, MagicMock
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from services.rsa_service import RSAService
class TestRSAService:
    """Test suite for the RSAService class"""

    def setup_method(self):
        """Setup before each test"""
        self.rsa_service = RSAService()
        
    def test_generate_key_pair_2048(self):
        """Test generating a 2048-bit RSA key pair"""
        keys = self.rsa_service.generate_key_pair(key_size=2048)
        
        # Verify return structure
        assert 'private_key' in keys
        assert 'public_key' in keys
        assert 'key_size' in keys
        assert keys['key_size'] == 2048
        
        # Verify keys are in PEM format
        assert keys['private_key'].startswith('-----BEGIN PRIVATE KEY-----')
        assert keys['private_key'].endswith('-----END PRIVATE KEY-----\n')
        assert keys['public_key'].startswith('-----BEGIN PUBLIC KEY-----')
        assert keys['public_key'].endswith('-----END PUBLIC KEY-----\n')
        
        # Verify class attributes are set
        assert self.rsa_service.private_key is not None
        assert self.rsa_service.public_key is not None
        assert self.rsa_service.key_size == 2048
    
    def test_generate_key_pair_1024(self):
        """Test generating a 1024-bit RSA key pair"""
        keys = self.rsa_service.generate_key_pair(key_size=1024)

        # Verify keys are in PEM format
        assert keys['private_key'].startswith('-----BEGIN PRIVATE KEY-----')
        assert keys['private_key'].endswith('-----END PRIVATE KEY-----\n')
        assert keys['public_key'].startswith('-----BEGIN PUBLIC KEY-----')
        assert keys['public_key'].endswith('-----END PUBLIC KEY-----\n')
        
        assert keys['key_size'] == 1024
        assert self.rsa_service.key_size == 1024
    
    def test_generate_key_pair_invalid_size(self):
        """Test generating a key pair with an invalid key size"""
        with pytest.raises(ValueError, match="Key size must be either 1024 or 2048 bits"):
            self.rsa_service.generate_key_pair(key_size=512)
    
    def test_encrypt_decrypt_small_text(self):
        """Test encrypting and decrypting a small text"""
        keys = self.rsa_service.generate_key_pair()
        plaintext = "Hello, RSA encryption test!"
        
        # Encrypt the message
        ciphertext = self.rsa_service.encrypt(plaintext)
        
        # Decrypt the message
        decrypted = self.rsa_service.decrypt(ciphertext)
        
        # Verify decryption works
        assert decrypted == plaintext
    
    def test_encrypt_decrypt_large_text(self):
        """Test encrypting and decrypting a text larger than one chunk"""
        keys = self.rsa_service.generate_key_pair()
        # Create a text that's definitely larger than the chunk size
        plaintext = "A" * 500
        
        # Encrypt the message
        ciphertext = self.rsa_service.encrypt(plaintext)
        
        # Verify it contains chunk separators
        assert '|' in ciphertext
        
        # Decrypt the message
        decrypted = self.rsa_service.decrypt(ciphertext)
        
        # Verify decryption works
        assert decrypted == plaintext
    
    def test_encrypt_with_provided_key(self):
        """Test encrypting with a provided public key"""
        # Generate keys
        public_key = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAko7tbVliBeqTjmxx86hh
SxhfSWGZ3qlVcTquXWmqJHx6/8s06GrceFCALbxwtP/cIgcNt4GMlEfkpuPjtCIn
L1Jr4bih5Uj56YpXkAhPogs9/vlgS8QOhbNl28NrVH/qBF/KdcAHMUMIfOgdmbDP
HgYggUoddHzLHenQzk4jnzLChp5TTZYSCSx+gLifQ7ffiiDF6B3/aNhCiShzVVDl
ae2TLoBHlnQ6XRfxYUqk2pPIuqpv5COIP2x5S7y4ZgRy9ETz25SkZOtrqRFAf1zz
8/SKmwkIq5HFEI3XB1hjcc4kxY7L/Z+YlFrKP/u2fZcFBnyt4pghskTg/6OJijap
swIDAQAB
-----END PUBLIC KEY-----"""

        private_key = """-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSju1tWWIF6pOO
bHHzqGFLGF9JYZneqVVxOq5daaokfHr/yzToatx4UIAtvHC0/9wiBw23gYyUR+Sm
4+O0IicvUmvhuKHlSPnpileQCE+iCz3++WBLxA6Fs2Xbw2tUf+oEX8p1wAcxQwh8
6B2ZsM8eBiCBSh10fMsd6dDOTiOfMsKGnlNNlhIJLH6AuJ9Dt9+KIMXoHf9o2EKJ
KHNVUOVp7ZMugEeWdDpdF/FhSqTak8i6qm/kI4g/bHlLvLhmBHL0RPPblKRk62up
EUB/XPPz9IqbCQirkcUQjdcHWGNxziTFjsv9n5iUWso/+7Z9lwUGfK3imCGyROD/
o4mKNqmzAgMBAAECggEAJKeYnDu5t28W3o0i5uTbCJQc6NZ/TGAfnYUmrPhLdHqp
rKYfIm3vnCvOEyJJMgu3+8610IqXJVLhzhe7EIdmM4CyuK6b1yOsVYujIMPjXszf
AZFPU0PCug/HTvKOOoEPf26RzWdspRZ13f+Tv6en9YNkx9FIkqTPjDi5X4/Nevgt
H+cSr7Y1b5o5s5AGxv5MqJhjKtbGZAnqkzS6xT8pi5mCqa4l9gdKxdGT7gVCyCvE
CYO+XLoiPtTnM6DWxBIyreEUuvvwnpUHDUiS3DdA2vKbTijvxqRnuwN3w5yboo8Q
SOVWAxLRfqpDyP25LPAaGKBQZ5c7iG40yFXPR9M4EQKBgQDtrFMblqx7b56WAQg1
spuv7d8O37TTxAe023NuKk5vb3bOmbn3GHBjWOFVJ62/KK4iy3PtHO6oVnM4rvFS
K6lOCVsAKxUgo/VZWflA3boJMXbXrJv0tgSTsiovMSTF9BzO18athprcIErMGr+v
aEP0UCkuUYZ586ARtFUQ38xkawKBgQCd2/49xxw8eCrqHFxdZlyN9lutJJZRyWNT
K54HxtGwJQ3jAK9EcqASuT1ofODHD4U3pidg7QbBEHxWJFBqGkrLtFzgrlESa0Tb
J+HI/HSHjInAmd1b710lIg12J1FBQxzyyMmuqZvhpg98ZmbduzPP/n32zGidvRYG
Dyaujfth2QKBgQCXfPsL3qHZm2+NVOMStuEc5ZUDOftb7tqqoCWW1khgJr+nN7yc
jms0J3aYfE32RcuYSe19+K71hQSz4G3YXhPvtW7XUJ6Ky3aamQqSGcF2Ep0ZIt/U
vh90tF7G7Z/uvIWQIWB1QhJ6s+p45aO//ckyc9WLvFLmcC5amoKN2tfAOQKBgE3M
fUmfFrhqlOPaZF8Xsqe4ccgsTvUx5oS362NzxiYkrOpijP6T63Yu2yfi27jfWk1p
0uB/EKQX5t9heExCdvhcBKYq4wPL4ByOVEWEvj2Lstw8OI81sdc6KB5CFFawp9Sz
xkoRhyS3fcxWf33p5AgvKY93gFu1M+R6lRrUGL9JAoGBAJkH5GCnM11sC7o4PeT/
4VV1vDygwyGp63tHehAy+UD6/xwoGTA6M9Ma3AzwfeVPiFCLBM+vTA2jK/kd4yHk
cd1c6iSNUMYkxTNL6PfGfvQSMktVeYOed6eBb2ITKCWYbYqrv8/WdMWEV6rLwOiw
SsF8X6LpkwEj4k40nK4DRql6
-----END PRIVATE KEY-----"""
               
        # Create a new service instance
        new_service = RSAService()
        
        # Encrypt with the provided key
        plaintext = "Test with provided key"
        ciphertext = new_service.encrypt(plaintext, public_key_pem=public_key)
        
        # Decrypt with the original service that has the private key
        decrypted = self.rsa_service.decrypt(ciphertext,private_key_pem=private_key)
        
        assert decrypted == plaintext
    
    def test_decrypt_with_provided_key(self):
        """Test decrypting with a provided private key"""
        # Generate keys
        private_key = """-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSju1tWWIF6pOO
bHHzqGFLGF9JYZneqVVxOq5daaokfHr/yzToatx4UIAtvHC0/9wiBw23gYyUR+Sm
4+O0IicvUmvhuKHlSPnpileQCE+iCz3++WBLxA6Fs2Xbw2tUf+oEX8p1wAcxQwh8
6B2ZsM8eBiCBSh10fMsd6dDOTiOfMsKGnlNNlhIJLH6AuJ9Dt9+KIMXoHf9o2EKJ
KHNVUOVp7ZMugEeWdDpdF/FhSqTak8i6qm/kI4g/bHlLvLhmBHL0RPPblKRk62up
EUB/XPPz9IqbCQirkcUQjdcHWGNxziTFjsv9n5iUWso/+7Z9lwUGfK3imCGyROD/
o4mKNqmzAgMBAAECggEAJKeYnDu5t28W3o0i5uTbCJQc6NZ/TGAfnYUmrPhLdHqp
rKYfIm3vnCvOEyJJMgu3+8610IqXJVLhzhe7EIdmM4CyuK6b1yOsVYujIMPjXszf
AZFPU0PCug/HTvKOOoEPf26RzWdspRZ13f+Tv6en9YNkx9FIkqTPjDi5X4/Nevgt
H+cSr7Y1b5o5s5AGxv5MqJhjKtbGZAnqkzS6xT8pi5mCqa4l9gdKxdGT7gVCyCvE
CYO+XLoiPtTnM6DWxBIyreEUuvvwnpUHDUiS3DdA2vKbTijvxqRnuwN3w5yboo8Q
SOVWAxLRfqpDyP25LPAaGKBQZ5c7iG40yFXPR9M4EQKBgQDtrFMblqx7b56WAQg1
spuv7d8O37TTxAe023NuKk5vb3bOmbn3GHBjWOFVJ62/KK4iy3PtHO6oVnM4rvFS
K6lOCVsAKxUgo/VZWflA3boJMXbXrJv0tgSTsiovMSTF9BzO18athprcIErMGr+v
aEP0UCkuUYZ586ARtFUQ38xkawKBgQCd2/49xxw8eCrqHFxdZlyN9lutJJZRyWNT
K54HxtGwJQ3jAK9EcqASuT1ofODHD4U3pidg7QbBEHxWJFBqGkrLtFzgrlESa0Tb
J+HI/HSHjInAmd1b710lIg12J1FBQxzyyMmuqZvhpg98ZmbduzPP/n32zGidvRYG
Dyaujfth2QKBgQCXfPsL3qHZm2+NVOMStuEc5ZUDOftb7tqqoCWW1khgJr+nN7yc
jms0J3aYfE32RcuYSe19+K71hQSz4G3YXhPvtW7XUJ6Ky3aamQqSGcF2Ep0ZIt/U
vh90tF7G7Z/uvIWQIWB1QhJ6s+p45aO//ckyc9WLvFLmcC5amoKN2tfAOQKBgE3M
fUmfFrhqlOPaZF8Xsqe4ccgsTvUx5oS362NzxiYkrOpijP6T63Yu2yfi27jfWk1p
0uB/EKQX5t9heExCdvhcBKYq4wPL4ByOVEWEvj2Lstw8OI81sdc6KB5CFFawp9Sz
xkoRhyS3fcxWf33p5AgvKY93gFu1M+R6lRrUGL9JAoGBAJkH5GCnM11sC7o4PeT/
4VV1vDygwyGp63tHehAy+UD6/xwoGTA6M9Ma3AzwfeVPiFCLBM+vTA2jK/kd4yHk
cd1c6iSNUMYkxTNL6PfGfvQSMktVeYOed6eBb2ITKCWYbYqrv8/WdMWEV6rLwOiw
SsF8X6LpkwEj4k40nK4DRql6
-----END PRIVATE KEY-----"""
        
        # Encrypt a message
        plaintext = "Hello 123"
        ciphertext = "UsPiRz8LGcGJF6YTA+aJhSSDCOTnEMUvaClDqHfq7tHiO2zlxh6tfkx/++EPd32o7W5gPXCWEFQlc7aZ492EZ6jTKkq/4+jRnZr5k4v3XnM6t57SCx2kghL7DiuQFx48Kep2wkE3B/cPCVmPIlHj0fysY0LFvsPSViWmT9PAGOopRpqwJMkFn2AGFUfshtmfOfphS0EoV0eB5JzlVt2OT+SQ+KywHSKdv+fmdyXtt9b5ulD4p+9CByIk/5Xs2aH4msC1A/Wm/Jj9U68xP/puaL26G1B7Jgs5dDpRMxHKx376uAPJ3JhL1xEcxqhZDWl6+1eosm5xxBn1eZ1QvYa7Yg=="
        
        # Create a new service instance
        new_service = RSAService()
        
        # Decrypt with the provided private key
        decrypted = new_service.decrypt(ciphertext, private_key_pem=private_key)
        
        assert decrypted == plaintext

    def test_decrypt_with_provided_key_special(self):
        """Test decrypting with a provided private key"""
        # Generate keys
        private_key = """-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSju1tWWIF6pOO
bHHzqGFLGF9JYZneqVVxOq5daaokfHr/yzToatx4UIAtvHC0/9wiBw23gYyUR+Sm
4+O0IicvUmvhuKHlSPnpileQCE+iCz3++WBLxA6Fs2Xbw2tUf+oEX8p1wAcxQwh8
6B2ZsM8eBiCBSh10fMsd6dDOTiOfMsKGnlNNlhIJLH6AuJ9Dt9+KIMXoHf9o2EKJ
KHNVUOVp7ZMugEeWdDpdF/FhSqTak8i6qm/kI4g/bHlLvLhmBHL0RPPblKRk62up
EUB/XPPz9IqbCQirkcUQjdcHWGNxziTFjsv9n5iUWso/+7Z9lwUGfK3imCGyROD/
o4mKNqmzAgMBAAECggEAJKeYnDu5t28W3o0i5uTbCJQc6NZ/TGAfnYUmrPhLdHqp
rKYfIm3vnCvOEyJJMgu3+8610IqXJVLhzhe7EIdmM4CyuK6b1yOsVYujIMPjXszf
AZFPU0PCug/HTvKOOoEPf26RzWdspRZ13f+Tv6en9YNkx9FIkqTPjDi5X4/Nevgt
H+cSr7Y1b5o5s5AGxv5MqJhjKtbGZAnqkzS6xT8pi5mCqa4l9gdKxdGT7gVCyCvE
CYO+XLoiPtTnM6DWxBIyreEUuvvwnpUHDUiS3DdA2vKbTijvxqRnuwN3w5yboo8Q
SOVWAxLRfqpDyP25LPAaGKBQZ5c7iG40yFXPR9M4EQKBgQDtrFMblqx7b56WAQg1
spuv7d8O37TTxAe023NuKk5vb3bOmbn3GHBjWOFVJ62/KK4iy3PtHO6oVnM4rvFS
K6lOCVsAKxUgo/VZWflA3boJMXbXrJv0tgSTsiovMSTF9BzO18athprcIErMGr+v
aEP0UCkuUYZ586ARtFUQ38xkawKBgQCd2/49xxw8eCrqHFxdZlyN9lutJJZRyWNT
K54HxtGwJQ3jAK9EcqASuT1ofODHD4U3pidg7QbBEHxWJFBqGkrLtFzgrlESa0Tb
J+HI/HSHjInAmd1b710lIg12J1FBQxzyyMmuqZvhpg98ZmbduzPP/n32zGidvRYG
Dyaujfth2QKBgQCXfPsL3qHZm2+NVOMStuEc5ZUDOftb7tqqoCWW1khgJr+nN7yc
jms0J3aYfE32RcuYSe19+K71hQSz4G3YXhPvtW7XUJ6Ky3aamQqSGcF2Ep0ZIt/U
vh90tF7G7Z/uvIWQIWB1QhJ6s+p45aO//ckyc9WLvFLmcC5amoKN2tfAOQKBgE3M
fUmfFrhqlOPaZF8Xsqe4ccgsTvUx5oS362NzxiYkrOpijP6T63Yu2yfi27jfWk1p
0uB/EKQX5t9heExCdvhcBKYq4wPL4ByOVEWEvj2Lstw8OI81sdc6KB5CFFawp9Sz
xkoRhyS3fcxWf33p5AgvKY93gFu1M+R6lRrUGL9JAoGBAJkH5GCnM11sC7o4PeT/
4VV1vDygwyGp63tHehAy+UD6/xwoGTA6M9Ma3AzwfeVPiFCLBM+vTA2jK/kd4yHk
cd1c6iSNUMYkxTNL6PfGfvQSMktVeYOed6eBb2ITKCWYbYqrv8/WdMWEV6rLwOiw
SsF8X6LpkwEj4k40nK4DRql6
-----END PRIVATE KEY-----"""
        
        # Encrypt a message
        plaintext = "åéîøü 你好 👋"
        ciphertext = "B+pypYPIE3wTS20D5vatseZ8WkIMsbwklCUYO2KcCjpPUYjVbFe41LaL4IRaQ5HhWfQ1bsmxKVmeVC4VwKokgvIstMGCZLkv0IeOop+GR6HOPMxsIX54RvqI/z4KeawjzJut7nZPPTqgSNFjcZNW6MgRlHWUcioB0YMI9VFIsurnp3YfU9DKqj5UUr+RXXKricONdhOtfMQvVFK4uvGVBV2hPrveBLTl8zJeBfvtZYs0weTdIwzeEHoihqvQPfGklhmzVpTNz65Z23uREOTcsyPFhmHpCAdfXkbdZQaz7ipdYaJdn79UxZzaIzj83SlLlkUSU/Y9JnAWvgg/wmPkaQ=="
        
        # Create a new service instance
        new_service = RSAService()
        
        # Decrypt with the provided private key
        decrypted = new_service.decrypt(ciphertext, private_key_pem=private_key)
        
        assert decrypted == plaintext
    
    def test_encrypt_decrypt_special_characters(self):
        """Test encrypting and decrypting text with special characters"""
        keys = self.rsa_service.generate_key_pair()
        plaintext = "Special chars: åéîøü 你好 👋 \n\t!@#$%^&*()"
        
        ciphertext = self.rsa_service.encrypt(plaintext)
        decrypted = self.rsa_service.decrypt(ciphertext)
        
        assert decrypted == plaintext
    
    def test_chunking_boundaries(self):
        """Test text that's exactly at chunk size boundaries"""
        # Test with 2048-bit key
        self.rsa_service.generate_key_pair(key_size=2048)
        
        # Test exactly one chunk
        exact_chunk = "A" * 190
        ciphertext = self.rsa_service.encrypt(exact_chunk)
        decrypted = self.rsa_service.decrypt(ciphertext)
        assert decrypted == exact_chunk
        
        # Test just over one chunk
        over_chunk = "A" * 191
        ciphertext = self.rsa_service.encrypt(over_chunk)
        # Should have a separator indicating multiple chunks
        assert '|' in ciphertext
        decrypted = self.rsa_service.decrypt(ciphertext)
        assert decrypted == over_chunk
        
        # Test with 1024-bit key
        self.rsa_service.generate_key_pair(key_size=1024)
        
        # Test exactly one chunk
        exact_chunk = "A" * 62
        ciphertext = self.rsa_service.encrypt(exact_chunk)
        decrypted = self.rsa_service.decrypt(ciphertext)
        assert decrypted == exact_chunk
        
        # Test just over one chunk
        over_chunk = "A" * 63
        ciphertext = self.rsa_service.encrypt(over_chunk)
        # Should have a separator indicating multiple chunks
        assert '|' in ciphertext
        decrypted = self.rsa_service.decrypt(ciphertext)
        assert decrypted == over_chunk