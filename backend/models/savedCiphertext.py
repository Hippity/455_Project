from database.database import db
import datetime

class SavedCiphertext(db.Model):
    __tablename__ = 'SavedCiphertext'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), nullable=False, index=True)
    user_email = db.Column(db.String(255), nullable=False)
    ciphertext = db.Column(db.Text, nullable=False)
    private_key = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)
