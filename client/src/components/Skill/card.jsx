import React from 'react';
import './card.css';    

const Card = ({ img, name, description }) => (
  <div className="card">
    <img src={img} alt={name} />
    <h3>{name}</h3>
    <div className="card__content">
      <p className="card__title">{name}</p>
      <p className="card__description">{description}</p>
    </div>
  </div>
);

export default Card;