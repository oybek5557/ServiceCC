const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const {
    service_id, customer_name, customer_email, customer_phone,
    vehicle_make, vehicle_model, vehicle_year,
    appointment_date, appointment_time, notes
  } = req.body;

  if (!service_id || !customer_name || !customer_email || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conflict = await pool.query(
      'SELECT id FROM bookings WHERE appointment_date = $1 AND appointment_time = $2 AND status != $3',
      [appointment_date, appointment_time, 'cancelled']
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const result = await pool.query(
      `INSERT INTO bookings
        (service_id, customer_name, customer_email, customer_phone,
         vehicle_make, vehicle_model, vehicle_year,
         appointment_date, appointment_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [service_id, customer_name, customer_email, customer_phone,
       vehicle_make, vehicle_model, vehicle_year,
       appointment_date, appointment_time, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query param required' });

  const allSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  try {
    const booked = await pool.query(
      `SELECT TO_CHAR(appointment_time, 'HH24:MI') as slot
       FROM bookings WHERE appointment_date = $1 AND status != 'cancelled'`,
      [date]
    );
    const bookedSlots = new Set(booked.rows.map(r => r.slot));
    const available = allSlots.filter(s => !bookedSlots.has(s));
    res.json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.name as service_name, s.price
       FROM bookings b JOIN services s ON b.service_id = s.id
       WHERE b.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
