import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();    
        const userData = {
          email,
          password,
        };
    
        try {
          const response = await axios.post('http://localhost:3000/api/login', userData);
          // localStorage.setItem(user_id, response.data.user_id)
          console.log(response.data)
          localStorage.setItem('user_id', response.data.user_id)
          localStorage.setItem('jwtToken', response.data.token);
          navigate('/gameplay')
        } catch (error) {
          console.log(error)
        }
      };

    return(
        <div className='loginPage--main'>
            <h1>Connectez-vous</h1>
            <form className='loginPage--form' onSubmit={handleSubmit}>
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
                <button type='submit'>Login</button>
            </form>
            <h4>Pas de compte?<Link to='/register'> Creer un maintenant</Link></h4>
            <Link to="/">Retounez à la page d'acceuil</Link>
        </div>
    )
}