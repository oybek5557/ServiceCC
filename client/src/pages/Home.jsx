import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../api';

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <>
      <div className="hero">
        <h1>Your Car Deserves<br /><span>Expert Care</span></h1>
        <p>Professional auto service with transparent pricing and easy online booking.</p>
        <Link to="/book" className="btn">Book an Appointment</Link>
      </div>

      <div>
        <div className="section-title">Our Services</div>
        <div className="section-sub">Choose from our range of professional auto services.</div>
        <div className="services-grid">
          {services.map(s => (
            <div key={s.id} className="service-card">
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
    </>
  );
}
