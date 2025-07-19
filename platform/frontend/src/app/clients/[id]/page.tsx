'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Company = {
  id: number;
  name: string;
  description: string;
};

type Booking = {
  id: number;
  date: string; // ISO format
  note: string;
}

async function getCompany(id: string): Promise<Company | null> {
  try {
    const res = await fetch(`http://localhost:3001/companies/${id}`, {
      //next: { revalidate: 10 } // Optional: ISR for fresh data every 10s
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch (err) {
    console.error('Error fetching company:', err);
    return null;
  }
}

async function getBookings(id: string): Promise<Booking[]> {
  try {
    const res = await fetch(`http://127.0.0.1:5001/bookings/${id}`);
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

export default function ClientPage({ params }: { params: { id: string } }) {
  // Unwrap the params using React.use()
  const { id } = params;

  //const company = await getCompany(params.id);
  const [company, setCompany] = useState<Company | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(null);

  useEffect(() => {
    (async () => {
      const [companyDate, bookingData] = await Promise.all([
        getCompany(id),
        getBookings(id)
      ]);
      setCompany(companyDate);
      setBookings(bookingData);
    })();
  }, [id]);

  const bookedDates = bookings.map(b => b.date);

  const handleBooking = async () => {
    // Ensure a valid single date is selected
    if (!selectedDate || Array.isArray(selectedDate)) {
      setBookingMessage('Please select a single date.');
      return;
    }

    try {
      // Connect to the booking-api Python/Flask API
      const res = await fetch('http://127.0.0.1:5001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: parseInt(id),
          date: selectedDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
          note: 'Booking via calendar'
        }),
      });

      if (!res.ok) {
        const text = await res.text();  // Read raw response
        //setBookingMessage(error.error || 'Failed to create the booking.');
        //return;
        console.error('Booking API error:', text);

        try {
          const error = JSON.parse(text);
          setBookingMessage(error.error || 'Failed to create the booking.');
        } catch {
          setBookingMessage('Unexpected response from Booking API.');
        }

        return;
      }

      const data = await res.json();
      setBookingMessage(`Booking created for ${data.date}`);
      setBookings([...bookings, { id: data.id, date: data.date, note: data.note }])
    } catch (err) {
      console.error(err);
      setBookingMessage('Error contacting the booking-api API service.');
    }
  };

  if (!company) {
    return <div>Client not found.</div>;
  }

  /*
  if (!company) {
    return <div>Client not found.</div>;
  }
  */

  const handleDateChange = (value: Date | Date[] | null, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setSelectedDate(value);
  };  

  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>

      <h2>Select a booking date:</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={({ date }) => bookedDates.includes(date.toISOString().split('T')[0])}
      />

      <button onClick={handleBooking} disabled={!selectedDate}>Make Booking on Date Selected</button>

      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
}
