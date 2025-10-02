// src/components/Footer.jsx
import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import "./components.css";

const Footer = () => {
  return (
    <footer className="footer">
      <h3>Connect with us</h3>
      <div className="social-icons">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
      </div>
      <div className="help-link">
        <a href="#contact">Contact the Help team</a>
      </div>
      <p className="copyright">
        © {new Date().getFullYear()} SkillBridge. Connecting skills with purpose.
      </p>
    </footer>
  );
};

export default Footer;
