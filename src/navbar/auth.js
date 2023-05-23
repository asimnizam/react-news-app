import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../components/home';
import Dashboard from '../components/dashboard';
import AuthUser from '../components/AuthUser';

function Auth() {
  const { token, logout } = AuthUser();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  const logoutUser = () => {
    if (token !== undefined) {
      logout();
      closeNavbar(); // Close the navbar menu after logout
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" to="/" onClick={closeNavbar}>
            News Aggregator
          </Link>
          <button
            className={`navbar-toggler ${isNavbarOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={toggleNavbar}
            aria-expanded={isNavbarOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ml-auto mr-auto" onClick={closeNavbar}>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <span role="button" className="nav-link" onClick={logoutUser}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Auth;
