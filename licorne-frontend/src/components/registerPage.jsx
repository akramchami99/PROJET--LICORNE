import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/register', userData);


        setSuccess('Registration successful!');
        // Navigate to login page after successful registration
        console.log(response.data)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='registerPage--main'>
      <h1>Inscription</h1>
      <form className='registerPage--form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Nom'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Inscrivez-vous</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p>{success}</p>}
      </form>
      <h4>
        Vous avez déjà un compte?<Link to='/login'> Connectez-vous</Link>
      </h4>
      <Link to="/">Retounez à la page d'acceuil</Link>
    </div>
  );
}
