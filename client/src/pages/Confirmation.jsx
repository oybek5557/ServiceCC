import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking } from '../api';

export default function Confirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getBooking(id).then(setBooking).catch(() => setError('Booking not found.'));
  }, [id]);

  if (error) return <div className="confirmation-card"><p className="error-msg">{error}</p></div>;
  if (!booking) return <div className="confirmation-card"><p>Loading...</p></div>;

  return (
    <div className="confirmation-card">
      <div className="check">✅</div>
      <h1>Booking Confirmed!</h1>
      <p>Thank you, {booking.customer_name}. See you soon!</p>

      <table className="detail-table">
        <tbody>
          <tr><td>Service</td><td>{booking.service_name}</td></tr>
          <tr><td>Date</td><td>{booking.appointment_date}</td></tr>
          <tr><td>Time</td><td>{booking.appointment_time}</td></tr>
          <tr><td>Price</td><td>${booking.price}</td></tr>
          {booking.vehicle_make && (
            <tr><td>Vehicle</td><td>{booking.vehicle_year} {booking.vehicle_make} {booking.vehicle_model}</td></tr>
          )}
          <tr><td>Email</td><td>{booking.customer_email}</td></tr>
          <tr><td>Booking ID</td><td>#{booking.id}</td></tr>
        </tbody>
      </table>

      <Link to="/" className="btn">Back to Home</Link>
    </div>
  );
}
