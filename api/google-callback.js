// frontend/api/google-callback.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = process.env;

// *** АДРЕС ДЛЯ VERCEL ***
const VERCEL_DOMAIN = 'https://nebagaficha-frontend-ktv6.vercel.app';
const REDIRECT_URI = `${VERCEL_DOMAIN}/api/google-callback`;


exports.handler = async function(event) {
  const { code, error } = event.queryStringParameters;
  
  if (error || !code) {
    console.error('Google auth error:', error || 'Missing code');
    return {
      statusCode: 302,
      headers: { Location: `${VERCEL_DOMAIN}/?error=google_auth_failed` },
    };
  }

  try {
    // 1. Обмен кода на токен доступа Google
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const accessToken = tokenResponse.data.access_token;
    
    // 2. Получение данных пользователя из Google API
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const googleUser = userResponse.data;
    
    // 3. Создание нашего JWT-токена
    const tokenPayload = {
      id: googleUser.sub, 
      username: googleUser.name || googleUser.email,
      email: googleUser.email,
      provider: 'google'
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // 4. Перенаправление на фронтенд Vercel с токеном
    return {
      statusCode: 302,
      headers: {
        Location: `${VERCEL_DOMAIN}/?token=${token}`,
        'Cache-Control': 'no-cache', 
      },
    };

  } catch (e) {
    console.error('Error during Google login:', e.response?.data || e.message);
    return {
      statusCode: 302,
      headers: { Location: `${VERCEL_DOMAIN}/?error=google_login_failed` },
    };
  }
};