from database.database import db
import datetime

class SavedCiphertext(db.Model):
    __tablename__ = 'SavedCiphertext'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), nullable=False, index=True)
    user_email = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    ciphertext = db.Column(db.Text, nullable=False)
    private_key = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user_email,
            'name': self.name,
            'ciphertext': self.ciphertext,
            'private_key': self.private_key,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }