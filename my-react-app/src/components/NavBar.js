import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from './firebase'; // Import Firebase auth]
import '../Styles/NavBar.css';
//import '../App.css';
import logo from '../Images/logo.png'; // Import your logo image

const Navbar = () => {
  const [bgColor, setBgColor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update navbar background color on scroll
  const changeNavbarBackgroundColor = () => {
    if (window.scrollY >= 70) {
      setBgColor(true);
    } else {
      setBgColor(false);
    }
  };

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Update authentication status
    });

    window.addEventListener("scroll", changeNavbarBackgroundColor);

    // Clean up event listener and auth subscription on unmount
    return () => {
      window.removeEventListener("scroll", changeNavbarBackgroundColor);
      unsubscribe();
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className={bgColor ? "app__navbar active" : "app__navbar"}>
      <div className="navbar__logo">
        <img src={logo} alt="Custom Logo" style={{ height: '50px' }} /> {/* Adjust height as needed */}
      </div>
      <ul className="navbar__routes">
        <li className="route">
          <Link to="/" className="navbar-link">
            Home
          </Link>
        </li>
        <li className="route">
          <a href="#features" className="navbar-link">
            Features
          </a>
        </li>
        <li className="route">
          <Link to="/dashboard" className="navbar-link dashboard-link">
            Dashboard
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li className="route">
              <Link to="/analysis" className="navbar-link">
                Analysis
              </Link>
            </li>
            <li className="route">
              <Link to="/prediction" className="navbar-link">
                Prediction
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="navbar__buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button
                style={{
                  color: bgColor ? "#0c1727" : "white",
                }}
                className="onebtn"
              >
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  color: bgColor ? "white" : "#0c1727",
                  background: bgColor ? "#0c1727" : "white",
                }}
              >
                Register
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              color: bgColor ? "white" : "#0c1727",
              background: bgColor ? "#0c1727" : "white",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
