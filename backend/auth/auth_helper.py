from flask import request, jsonify
from functools import wraps

def get_user_info_from_request():
    """
    Extract user information from Azure App Service Authentication headers
    
    Returns:
        dict: User information including id, email, and name
    """

    user_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')
    print(user_id)
    
    if not user_id:
        return None
    
    user_email = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
    print(user_email)

    # Create a user info object
    user_info = {
        'user_id': user_id,
        'email': user_email or user_id,  # Fallback to ID if email is not available
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