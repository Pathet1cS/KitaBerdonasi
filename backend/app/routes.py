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
        
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'token': access_token,
        'role': user.role,
        'association_id': user.association_id if user.role == 'association_admin' else None
    }), 200
    
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

@main.route('/associations', methods=['POST'])
def create_association():
    data = request.get_json()
    
    new_association = Association(
        name=data['name'],
        description=data['description'],
        address=data['address'],
        phone=data['phone']
    )
    
    try:
        db.session.add(new_association)
        db.session.commit()
        return jsonify({'id': new_association.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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
        current_user_id = get_jwt_identity()
        
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


@main.route('/association/donations', methods=['GET'])
@jwt_required()
def get_association_donations():
    try:
        # Get user_id dari token
        current_user_id = get_jwt_identity()
        
        # Get user data termasuk association_id
        user = User.query.get(current_user_id)
        if not user or user.role != 'association_admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        # Get donations berdasarkan association_id
        donations = Donation.query.filter_by(association_id=user.association_id).all()
        
        return jsonify([{
            'id': d.id,
            'item_name': d.item_name,
            'description': d.description,
            'quantity': d.quantity,
            'status': d.status,
            'created_at': d.created_at.isoformat(),
            'donor_name': d.donor.username,
            'donor_email': d.donor.email
        } for d in donations]), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@main.route('/association/donations/<int:donation_id>', methods=['PATCH'])
@jwt_required()
def update_donation_status(donation_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'association_admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        donation = Donation.query.filter_by(
            id=donation_id, 
            association_id=user.association_id
        ).first()
        
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404

        donation.status = data['status']
        db.session.commit()
        
        return jsonify({
            'message': 'Status updated successfully',
            'donation': {
                'id': donation.id,
                'status': donation.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main.route('/register/association-admin', methods=['POST'])
def register_association_admin():
    data = request.get_json()
    
    # Validasi input
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    # Jika ada association_id, gunakan association yang sudah ada
    if 'association_id' in data and data['association_id']:
        association = Association.query.get(data['association_id'])
        if not association:
            return jsonify({'error': 'Association not found'}), 404
            
        # Cek apakah asosiasi sudah memiliki admin
        if User.query.filter_by(
            role='association_admin', 
            association_id=data['association_id']
        ).first():
            return jsonify({'error': 'Association already has an admin'}), 400
            
        association_id = data['association_id']
    else:
        # Buat association baru jika tidak ada association_id
        try:
            new_association = Association(
                name=data['association_name'],
                description=data['description'],
                address=data['address'],
                phone=data['phone']
            )
            db.session.add(new_association)
            db.session.flush()  # Untuk mendapatkan ID asosiasi baru
            association_id = new_association.id
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create association: {str(e)}'}), 500

    # Buat user admin asosiasi
    try:
        hashed_password = generate_password_hash(data['password'])
        new_admin = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            role='association_admin',
            association_id=association_id
        )
        
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({'message': 'Association and admin registered successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500