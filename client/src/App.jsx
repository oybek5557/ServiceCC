import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Book from './pages/Book';
import Confirmation from './pages/Confirmation';
import Navbar from './components/Navbar';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
