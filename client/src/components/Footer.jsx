import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Naksh Jewels offers the finest premium jewelry collection with authentic craftsmanship and quality assurance.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@nakshshwels.com</p>
          <p>Phone: +91-1234567890</p>
          <p>Address: New Delhi, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Naksh Jewels. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
