import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, '/');
    }

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:5001/api/profile')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="container">
      <header>
        <div className="logo">Не баг<span>, а фича</span></div>
        {user ? (
          <div className="auth-info">
            Привет, <strong>{user.username}</strong>!
            <button onClick={logout} className="logout-btn">Выйти</button>
          </div>
        ) : (
          <a href="http://localhost:5001/api/auth/github" className="btn">Войти через GitHub</a>
        )}
      </header>

      <section className="hero">
        <h1>404: Love Not Found → 200: OK</h1>
        <p>Ты не странный. Ты <strong>feature-rich</strong>.</p>

        {user && (
          <div className="profile-card">
            <img src={user.avatar} alt="Avatar" />
            <h3>@{user.username}</h3>
            <p>{user.email || 'Email скрыт'}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;