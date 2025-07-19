from flask import Flask, request, jsonify
from flask_cors import CORS 
from datetime import datetime
from models import db, Booking

app = Flask(__name__)
CORS(app)

# Setup and create the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///booking-dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    # print("📦 Models loaded:", db.Model._decl_class_registry.keys())  # Should include 'Booking'
    # db.create_all()
    import models  # 👈 ensure models are loaded
    models.db.metadata.create_all(bind=models.db.engine)
    print("✅ Tables created")

@app.route('/')
def index():
    return 'Booking API is running', 200

@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.json 
    company_id = data.get('company_id')
    date_str = data.get('date')
    note = data.get('note', '')

    if not company_id or not date_str:
        return jsonify({'error': 'company_id and date are required'}), 400

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'error': 'Invalid date format, expected YYYY-MM-DD'}), 400

    # Prevent double booking
    existing = Booking.query.filter_by(company_id=company_id, date=date).first()
    if existing:
        return jsonify({'error': 'This date is already booked'}), 409

    booking = Booking(company_id=company_id, date=date, note=note)
    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'id': booking.id,
        'company_id': booking.company_id,
        'date': booking.date.isoformat(),
        'timestamp': booking.timestamp,
        'note': booking.note
    }), 201

@app.route('/bookings/<int:company_id>', methods=['GET'])
def get_bookings(company_id):
    bookings = Booking.query.filter_by(company_id=company_id).all()
    return jsonify([{
        'id': b.id,
        'date': b.date.isoformat(), # Return the booked date
        'note': b.note
    } for b in bookings])

if __name__ == '__main__':
    app.run(port=5001)