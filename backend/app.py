from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from services.rsa_service import RSAService
import os
from auth.auth_helper import require_auth
from models.savedCiphertext import SavedCiphertext
from database.database import db
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Create a global RSA service instance
rsa_service = RSAService()

# Initialise db
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
db.init_app(app)

# Create tables in the DB
with app.app_context():
    from models.savedCiphertext import SavedCiphertext

    if app.config["SQLALCHEMY_DATABASE_URI"]:
        db.create_all()

def is_valid_utf8(text):
    try:
        text.encode('utf-8').decode('utf-8')
        return True
    except UnicodeError:
        return False

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

        if not public_key.strip() or not plaintext.strip():
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
        
        if not private_key.strip() or not ciphertext.strip():
            return jsonify({
                'success': False,
                'error': 'Private key and ciphertext are required'
            }), 400
        
        # After extracting text, validate UTF-8
        if not is_valid_utf8(ciphertext):
            return jsonify({
                'success': False,
                'error': 'Plaintext contains non-UTF-8 characters. Only UTF-8 encoded characters are supported.'
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

@app.route('/api/saved-ciphertexts', methods=['GET'])
@require_auth
def get_saved_ciphertexts(user_info):
    """
    Get all saved ciphertexts for the authenticated user
    """
    try:
        # Get user ID from auth info
        user_id = user_info['user_id']
        
        # Query saved ciphertexts for this user
        saved_ciphertexts = SavedCiphertext.query.filter_by(user_id=user_id).order_by(SavedCiphertext.created_at).all()

        # Convert to list of dicts
        result = [item.to_dict() for item in saved_ciphertexts]
        
        for item in result:
            item.pop('private_key', None)
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/saved-ciphertexts', methods=['POST'])
@require_auth
def create_saved_ciphertext(user_info):
    """
    Create a new saved ciphertext
    """
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'ciphertext', 'privateKey']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Field "{field}" is required'
                }), 400
        
        # Get user info from auth
        user_id = user_info['user_id']
        user_email = user_info['email']
        
        # Create new saved ciphertext
        saved_ciphertext = SavedCiphertext(
            user_id=user_id,
            user_email=user_email,
            name=data['name'],
            ciphertext=data['ciphertext'],
            private_key=data['privateKey']
        )
        
        # Save to database
        db.session.add(saved_ciphertext)
        db.session.commit()

        data = saved_ciphertext.to_dict()
        data.pop('private_key', None)
        
        return jsonify({
            'success': True,
            'data': data,
            'message': 'Saved ciphertext created successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/saved-ciphertexts/<ciphertext_id>', methods=['DELETE'])
@require_auth
def delete_saved_ciphertext(ciphertext_id, user_info):
    """
    Delete a specific saved ciphertext
    """
    try:
        # Get user ID from auth info
        user_id = user_info['user_id']
        
        # Find the saved ciphertext and verify ownership
        saved_ciphertext = SavedCiphertext.query.filter_by(id=ciphertext_id, user_id=user_id).first()
        
        if not saved_ciphertext:
            return jsonify({
                'success': False,
                'error': 'Saved ciphertext not found or not owned by you'
            }), 404
        
        # Delete the record
        db.session.delete(saved_ciphertext)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Saved ciphertext deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    
@app.route('/api/saved-ciphertexts/<ciphertext_id>/decrypt', methods=['POST'])
@require_auth
def decrypt_saved_ciphertext(ciphertext_id, user_info):
    """
    Decrypt a specific saved ciphertext
    """
    try:
        # Get user ID from auth info
        user_id = user_info['user_id']
        
        # Find the saved ciphertext and verify ownership
        saved_ciphertext = SavedCiphertext.query.filter_by(id=ciphertext_id, user_id=user_id).first()
        
        if not saved_ciphertext:
            return jsonify({
                'success': False,
                'error': 'Saved ciphertext not found or not owned by you'
            }), 404
        
        # Decrypt the ciphertext
        plaintext = rsa_service.decrypt(saved_ciphertext.ciphertext, saved_ciphertext.private_key)
        
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

@app.route('/api/avalanche', methods=['POST'])
def avalanche_effect():
    data = request.get_json()
    public_key = data.get('publicKey')
    plaintext = data.get('plaintext')
    print(public_key, plaintext)

    if not public_key or not plaintext:
        return jsonify({"error": "Missing parameters"}), 400
    
    try:
        result = RSAService().compute_avalanche_effect(public_key, plaintext)
        print(result)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/extract-text', methods=['POST'])
def extract_text():
    """
    Extract text from uploaded file (supports .doc, .docx, .pdf, .txt)
    """
    try:
        # Check if file is in the request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file uploaded'
            }), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No selected file'
            }), 400

        # Secure the filename and get extension
        filename = secure_filename(file.filename)
        file_ext = os.path.splitext(filename)[1].lower()

        # Read file based on extension
        if file_ext == '.txt':
            text = file.read().decode('utf-8')
        elif file_ext == '.pdf':
            reader = PyPDF2.PdfReader(file)
            text = '\n'.join([page.extract_text() for page in reader.pages])
        elif file_ext in ('.doc', '.docx'):
            doc = Document(file)
            text = '\n'.join([para.text for para in doc.paragraphs])
        else:
            return jsonify({
                'success': False,
                'error': 'Unsupported file type'
            }), 400

        # After extracting text, validate UTF-8
        if not is_valid_utf8(text):
            return jsonify({
                'success': False,
                'error': 'File contains non-UTF-8 characters. Only UTF-8 encoded files are supported.'
            }), 400

        return jsonify({
            'success': True,
            'data': {
                'text': text,
                'filename': filename
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