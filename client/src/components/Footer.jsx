
import React from 'react';
import './Footer.css'; // Make sure you have your CSS in this file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <h3 className="footer__title">Our Services</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Support</a></li>
            <li><a href="#" className="footer__link">Donate</a></li>
            <li><a href="#" className="footer__link">Report a bug</a></li>
            <li><a href="#" className="footer__link">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Our Company</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Blog</a></li>
            <li><a href="#" className="footer__link">Our mission</a></li>
            <li><a href="#" className="footer__link">Get in touch</a></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Community</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Support</a></li>
            <li><a href="#" className="footer__link">Questions</a></li>
            <li><a href="#" className="footer__link">Usage help</a></li>
          </ul>
        </div>

        <div className="footer__social">
          <a href="#" className="footer__social-link"><i className="bx bxl-facebook-circle"></i></a>
          <a href="#" className="footer__social-link"><i className="bx bxl-github"></i></a>
          <a href="#" className="footer__social-link"><i className="bx bxl-instagram"></i></a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
