import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, getAvailableSlots, createBooking } from '../api';

const today = new Date().toISOString().split('T')[0];

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    service_id: '',
    appointment_date: today,
    appointment_time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    notes: '',
  });

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  useEffect(() => {
    if (form.appointment_date) {
      getAvailableSlots(form.appointment_date).then(setSlots);
      setForm(f => ({ ...f, appointment_time: '' }));
    }
  }, [form.appointment_date]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nextStep = () => {
    setError('');
    if (step === 1 && !form.service_id) return setError('Please select a service.');
    if (step === 2 && !form.appointment_time) return setError('Please select a time slot.');
    if (step === 3) {
      if (!form.customer_name || !form.customer_email) return setError('Name and email are required.');
      return submit();
    }
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const booking = await createBooking({
        ...form,
        service_id: Number(form.service_id),
        vehicle_year: form.vehicle_year ? Number(form.vehicle_year) : null,
      });
      navigate(`/confirmation/${booking.id}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === Number(form.service_id));

  return (
    <div>
      <div className="section-title">Book a Service</div>
      <div className="section-sub">Complete the steps below to schedule your appointment.</div>

      <div className="steps">
        {['Select Service', 'Pick Date & Time', 'Your Details'].map((label, i) => (
          <div
            key={i}
            className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
            onClick={() => step > i + 1 && setStep(i + 1)}
            style={{ cursor: step > i + 1 ? 'pointer' : 'default' }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="booking-form">
        {step === 1 && (
          <div className="form-section">
            <h2>Choose a service</h2>
            <div className="services-grid">
              {services.map(s => (
                <div
                  key={s.id}
                  className={`service-card ${form.service_id === String(s.id) ? 'selected' : ''}`}
                  onClick={() => set('service_id', String(s.id))}
                >
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <div className="meta">
                    <span className="price">${s.price}</span>
                    <span className="duration">{s.duration_minutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2>Pick a date</h2>
            <div className="form-group" style={{ maxWidth: 220 }}>
              <label>Date</label>
              <input
                type="date"
                min={today}
                value={form.appointment_date}
                onChange={e => set('appointment_date', e.target.value)}
              />
            </div>
            <h2>Available time slots</h2>
            {slots.length === 0
              ? <p style={{ color: '#888' }}>No slots available for this date.</p>
              : (
                <div className="slots-grid">
                  {slots.map(slot => (
                    <div
                      key={slot}
                      className={`slot ${form.appointment_time === slot ? 'selected' : ''}`}
                      onClick={() => set('appointment_time', slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2>Your information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.customer_name} onChange={e => set('customer_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 280 }}>
              <label>Phone</label>
              <input value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} />
            </div>

            <h2 style={{ marginTop: '1rem' }}>Vehicle information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Make</label>
                <input placeholder="e.g. Toyota" value={form.vehicle_make} onChange={e => set('vehicle_make', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input placeholder="e.g. Camry" value={form.vehicle_model} onChange={e => set('vehicle_model', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 140 }}>
              <label>Year</label>
              <input type="number" min="1990" max="2030" placeholder="2022" value={form.vehicle_year} onChange={e => set('vehicle_year', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional information..." />
            </div>

            {selectedService && (
              <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: 8, marginTop: '0.5rem', fontSize: '0.92rem' }}>
                <strong>Summary:</strong> {selectedService.name} on {form.appointment_date} at {form.appointment_time} — ${selectedService.price}
              </div>
            )}
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
          )}
          <button className="btn" onClick={nextStep} disabled={loading}>
            {loading ? 'Booking...' : step === 3 ? 'Confirm Booking' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
