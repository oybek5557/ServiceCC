import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo">ServiceCC</Link>
      <div>
        <Link to="/">Home</Link>
        <Link to="/book">Book Service</Link>
      </div>
    </nav>
  );
}
