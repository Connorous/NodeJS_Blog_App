import "../styles/app-styles.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function NavBar({ token, user }) {
  if (token) {
    return (
      <section className="top-section">
        <h1 className="top">Blog Post Writer</h1>
        <div className="top-bar">
          <div className="top-bar-left">
            <Link
              to="/"
              className="top"
            >
              <h3 className="nav">Your Blog Posts</h3>
            </Link>
            <h3>Welcome {user.email}</h3>
          </div>
          <div className="top-bar-right">
            <Link
              to="/logout"
              className="top"
            >
              <h3 className="nav">Logout</h3>
            </Link>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="top-section">
        <h1 className="top">Blop Post Writer</h1>
        <div className="top-bar">
          <div className="top-bar-left">
            <Link
              to="/"
              className="top"
            >
              <h3 className="nav">Your Blog Posts</h3>
            </Link>
          </div>
          <div className="top-bar-right">
            <Link
              to="/login"
              className="top"
            >
              <h3 className="nav">Login</h3>
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default NavBar;
