from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Booking(db.Model):
    __tablename__ = 'booking'   # optional, but explicit
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, nullable=False)
    # Store the specific date the user wants to make a booking
    date = db.Column(db.Date, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    note = db.Column(db.String, nullable=True)