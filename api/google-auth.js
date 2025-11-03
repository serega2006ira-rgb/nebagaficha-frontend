// frontend/api/google-auth.js
const { GOOGLE_CLIENT_ID } = process.env;

// *** АДРЕС ДЛЯ VERCEL ***
const VERCEL_DOMAIN = 'https://nebagaficha-frontend-ktv6.vercel.app';
const REDIRECT_URI = `${VERCEL_DOMAIN}/api/google-callback`;

// Генерация случайной строки для состояния (безопасность)
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

exports.handler = async function(event, context) {
  if (!GOOGLE_CLIENT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GOOGLE_CLIENT_ID is missing' })
    };
  }

  const state = generateRandomString(16);
  
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid profile email', // Запрашиваем данные пользователя
      redirect_uri: REDIRECT_URI,
      state: state,
      access_type: 'online'
    }).toString();

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache', 
    },
  };
};