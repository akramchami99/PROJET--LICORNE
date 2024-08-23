import React from 'react';
import { Link } from 'react-router-dom';

export default function GamePage() {
  return (
    <div className='gamePage--main'>
      <h1>LICORNE AVENTURES</h1>
      <div className='gamePage--buttons'>
        <Link to="/login" className='gamePage--button'>LOGIN</Link>
        <Link to="/register" className='gamePage--button'>REGISTER</Link>
      </div>
    </div>
  );
}
