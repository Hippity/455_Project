from flask import Flask, request, jsonify
from flask_cors import CORS
from services.rsa_service import RSAService

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a global RSA service instance
rsa_service = RSAService()

@app.route('/api/generate', methods=['POST'])
def generate_keys():
    """
    Generate RSA key pair based on the specified key size
    """
    try:
        data = request.get_json()
        key_size = data.get('keySize', 2048)
        
        # Validate key size
        if key_size not in [1024, 2048]:
            return jsonify({
                'success': False,
                'error': 'Key size must be either 1024 or 2048 bits'
            }), 400
            
        # Generate key pair
        key_pair = rsa_service.generate_key_pair(key_size)
        
        return jsonify({
            'success': True,
            'data': key_pair
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/encrypt', methods=['POST'])
def encrypt_message():
    """
    Encrypt a message using RSA public key
    """
    try:
        data = request.get_json()
        public_key = data.get('publicKey')
        plaintext = data.get('plaintext')
        
        if not public_key or not plaintext:
            return jsonify({
                'success': False,
                'error': 'Public key and plaintext are required'
            }), 400
            
        ciphertext = rsa_service.encrypt(plaintext, public_key)
        
        return jsonify({
            'success': True,
            'data': {
                'ciphertext': ciphertext
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/decrypt', methods=['POST'])
def decrypt_message():
    """
    Decrypt a message using RSA private key
    """
    try:
        data = request.get_json()
        private_key = data.get('privateKey')
        ciphertext = data.get('ciphertext')
        
        if not private_key or not ciphertext:
            return jsonify({
                'success': False,
                'error': 'Private key and ciphertext are required'
            }), 400
            
        plaintext = rsa_service.decrypt(ciphertext, private_key)
        
        return jsonify({
            'success': True,
            'data': {
                'plaintext': plaintext
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)