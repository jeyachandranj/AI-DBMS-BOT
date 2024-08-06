import React from 'react';
import './Footer.css';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoTwitter, logoLinkedin, logoInstagram } from 'ionicons/icons';

function Footer() {
  return (
    <div className="App" style={{height:"50px"}}>
      <footer className="footer">
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
          <div className="wave" id="wave4"></div>
        </div>
        <ul className="social-icon">
          <li className="social-icon__item">
            <a className="social-icon__link" href="#">
              <IonIcon icon={logoFacebook} />
            </a>
          </li>
          <li className="social-icon__item">
            <a className="social-icon__link" href="#">
              <IonIcon icon={logoTwitter} />
            </a>
          </li>
          <li className="social-icon__item">
            <a className="social-icon__link" href="#">
              <IonIcon icon={logoLinkedin} />
            </a>
          </li>
          <li className="social-icon__item">
            <a className="social-icon__link" href="#">
              <IonIcon icon={logoInstagram} />
            </a>
          </li>
        </ul>
        <ul className="menu">
          <li className="menu__item">
            <a className="menu__link" href="#">Home</a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href="#">About</a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href="#">Services</a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href="#">Team</a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href="#">Contact</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
