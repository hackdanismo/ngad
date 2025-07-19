'use client';

import React, { useState, useEffect } from 'react';

type Company = {
  id: number;
  name: string;
  description: string;
};

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

export default function ClientPage({ params }: { params: { id: string } }) {
  //const company = await getCompany(params.id);
  const [company, setCompany] = useState<Company | null>(null);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    (async () => {
      const result = await getCompany(params.id);
      setCompany(result);
    })();
  }, [params.id]);

  const handleBooking = async () => {
    try {
      // Connect to the booking-api Python/Flask API
      const res = await fetch('http://127.0.0.1:5001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: parseInt(params.id),
          note: 'Booking created from the frontend'
        }),
      });

      if (!res.ok) {
        setBookingMessage('Failed to create booking.');
        return;
      }

      const data = await res.json();
      setBookingMessage(`Booking created at ${new Date(data.timestamp).toLocaleString()}`);
    } catch (err) {
      console.error(err);
      setBookingMessage('Error contacting the booking-api service.');
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

  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>

      <button onClick={handleBooking}>Make Booking</button>

      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
}
