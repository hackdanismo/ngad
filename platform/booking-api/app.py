from flask import Flask, request, jsonify
from flask_cors import CORS 
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
    note = data.get('note', '')

    if not company_id:
        return jsonify({'error': 'company_id is required'}), 400

    booking = Booking(company_id=company_id, note=note)
    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'id': booking.id,
        'company_id': booking.company_id,
        'timestamp': booking.timestamp,
        'note': booking.note
    }), 201

@app.route('/bookings/<int:company_id>', methods=['GET'])
def get_bookings(company_id):
    bookings = Booking.query.filter_by(company_id=company_id).all()
    return jsonify([{
        'id': b.id,
        'timestamp': b.timestamp,
        'note': b.note
    } for b in bookings])

if __name__ == '__main__':
    app.run(port=5001)