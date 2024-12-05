from datetime import datetime
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user', 'admin', or 'association_admin'
    association_id = db.Column(db.Integer, db.ForeignKey('association.id'), nullable=True)
    donations = db.relationship('Donation', backref='donor', lazy=True)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Association(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    donations = db.relationship('Donation', backref='association', lazy=True)
    
    def __repr__(self):
        return f'<Association {self.name}>'

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    association_id = db.Column(db.Integer, db.ForeignKey('association.id'), nullable=False)
    
    def __repr__(self):
        return f'<Donation {self.item_name}>'
