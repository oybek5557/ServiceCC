import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getServices = () => api.get('/services').then(r => r.data);
export const getAvailableSlots = (date) => api.get('/bookings/slots', { params: { date } }).then(r => r.data);
export const createBooking = (data) => api.post('/bookings', data).then(r => r.data);
export const getBooking = (id) => api.get(`/bookings/${id}`).then(r => r.data);
