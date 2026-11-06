import { Link, useNavigate, useLocation } from "react-router-dom";

const Wrapper = ({ handlelogout, token, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {handlelogout(); navigate("/login");};

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/buses" className="nav-link">Buses</Link>
        {token && (
          <Link to="/booking" className="nav-link">My Bookings</Link>)
        }
        {location.pathname !== "/login" && (
          token ? (
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          ))
        }
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Wrapper;
