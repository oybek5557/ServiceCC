CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  vehicle_make VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO services (name, description, duration_minutes, price) VALUES
  ('Oil Change', 'Full synthetic oil change with filter replacement', 30, 49.99),
  ('Tire Rotation', 'Rotate all four tires for even wear', 45, 29.99),
  ('Brake Inspection', 'Complete brake system inspection', 60, 39.99),
  ('Engine Diagnostics', 'Computer diagnostics scan and report', 60, 79.99),
  ('AC Service', 'Air conditioning check and recharge', 90, 99.99),
  ('Full Service', 'Oil change, tire rotation, fluid top-up, and inspection', 120, 149.99)
ON CONFLICT DO NOTHING;
