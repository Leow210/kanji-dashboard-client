// Navbar.js
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth(); // Correctly destructure 'user' from the context value

  return (
    <nav className="navbar">
      {/* Your navbar content, including the welcome message */}
      {user && <span>Welcome, {user.username}</span>}
    </nav>
  );
};

export default Navbar;
