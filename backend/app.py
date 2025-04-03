from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from services.rsa_service import RSAService
import os
from auth.auth_helper import require_auth
from database.database import db

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Create a global RSA service instance
rsa_service = RSAService()

# Initialise DB
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
db.init_app(app)

# Create tables in the DB
with app.app_context():
    from models.savedCiphertext import SavedCiphertext

    if app.config["SQLALCHEMY_DATABASE_URI"]:
        db.create_all()

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

@app.route('/api/test-auth', methods=['GET'])
@require_auth
def test_auth(user_info):
    """
    Test if auth is working
    """
    try:
        return jsonify({
            'success': True,
            'data': {
                'user_info': user_info
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

@app.route('/health')
def health_check():
    """
    Health check endpoint for Azure
    """
    return jsonify({
        'status': 'healthy',
        'service': 'RSA-455'
    })

if __name__ == '__main__':
    # Get port from environment variable (for Azure) or use default 5000
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)