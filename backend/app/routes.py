from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User, Association, Donation
from . import db

main = Blueprint('main', __name__)

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    # Konversi user.id ke string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'token': access_token}), 200

@main.route('/associations', methods=['GET'])
def get_associations():
    associations = Association.query.all()
    return jsonify([{
        'id': a.id,
        'name': a.name,
        'description': a.description,
        'address': a.address,
        'phone': a.phone
    } for a in associations]), 200

@main.route('/donations', methods=['POST'])
@jwt_required()
def create_donation():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_donation = Donation(
        item_name=data['item_name'],
        description=data['description'],
        quantity=data['quantity'],
        user_id=user_id,
        association_id=data['association_id']
    )
    
    db.session.add(new_donation)
    db.session.commit()
    
    return jsonify({'message': 'Donation created successfully'}), 201

@main.route('/donations', methods=['GET'])
@jwt_required()
def get_user_donations():
    try:
        # Debug log
        print("Request headers:", request.headers)
        
        # Cek token
        current_user_id = get_jwt_identity()
        print("Current user ID:", current_user_id)
        
        if not current_user_id:
            return jsonify({"msg": "Missing or invalid token"}), 401
            
        donations = Donation.query.filter_by(user_id=current_user_id).all()
        print(f"Found {len(donations)} donations")
        
        return jsonify([{
            'id': d.id,
            'item_name': d.item_name,
            'description': d.description,
            'quantity': d.quantity,
            'status': d.status,
            'created_at': d.created_at.isoformat(),
            'association': d.association.name if d.association else None
        } for d in donations]), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"msg": str(e)}), 500