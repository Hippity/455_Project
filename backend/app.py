from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from services.rsa_service import RSAService
import os

app = Flask(__name__, static_folder='static')
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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React application for all non-API routes
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Add more routes for health checks (useful for Azure)
@app.route('/health')
def health_check():
    """
    Health check endpoint for Azure
    """
    return jsonify({
        'status': 'healthy',
        'service': 'RSA-455'
    })

"""
Azure Authentication
https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization
https://rsa-455-dcgtggf8a7hnfddf.uaenorth-01.azurewebsites.net/.auth/login/google	
I already set up the OPENID to login to with google this is the callback path
https://rsa-455-dcgtggf8a7hnfddf.uaenorth-01.azurewebsites.net/.auth/login/google/callback
Login Path 
https://rsa-455-dcgtggf8a7hnfddf.uaenorth-01.azurewebsites.net/.auth/login/google	
"""


if __name__ == '__main__':
    # Get port from environment variable (for Azure) or use default 5000
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)