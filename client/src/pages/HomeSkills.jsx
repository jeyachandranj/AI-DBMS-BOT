import React from 'react';
import Card from '../components/Skill/card'
import { Link } from 'react-router-dom';
import i1 from '../assets/read.png';
import i2 from '../assets/write.png';
import i3 from '../assets/listen.png';
import i4 from '../assets/speak.png';
import './HomeSkills.css';

function HomeSkills() {

  return (
    <>
    <div className='row'>
      <div className='col-5 p-5-m' style={{marginLeft:'250px'}}>
       <Link to='/listen'><Card img={i3} name="Listen"/></Link>
      </div>
      <div className='col-5 p-5-m'>
        <Card img={i4} name="Speak"/>
      </div>
      <div className='col-5 p-5-m 'style={{marginLeft:'250px'}}>
      <Link to='/read'><Card img={i1} name="Read"/></Link>
      </div>
      <div className='col-5 p-5-m '>
      <Link to='/write'><Card img={i2} name="Write"/></Link>
      </div>
      
      
    </div>
    </>
  )
}

export default HomeSkills