from flask import request, jsonify
from functools import wraps
import os

def get_user_info_from_request():
    """
    Extract user information from Azure App Service Authentication headers
    """

    if os.environ.get("IS_DEV"):
        return {
            'user_id': 'dev-user-id',
            'email': 'dev@example.com',
        }

    user_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')
    
    if not user_id:
        return None
    
    user_email = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')

    # Create a user info object
    user_info = {
        'user_id': user_id,
        'email': user_email,  
    }
    
    return user_info

def require_auth(f):
    """
    Decorator to require authentication for a route
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_info = get_user_info_from_request()
        
        if not user_info:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        # Add user_info to kwargs so the route handler can access it
        kwargs['user_info'] = user_info
        return f(*args, **kwargs)
    
    return decorated_function