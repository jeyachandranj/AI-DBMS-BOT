import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">AI Interview Practice</div>
      <nav>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#signin">Sign In</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
