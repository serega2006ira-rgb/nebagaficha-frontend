// frontend/api/google-auth.js
// Начинает авторизацию через Google

const { GOOGLE_CLIENT_ID } = process.env;

// *** АДРЕС ДЛЯ VERCEL ***
const VERCEL_DOMAIN = 'https://nebagaficha-frontend-ktv6.vercel.app';
const REDIRECT_URI = `${VERCEL_DOMAIN}/api/google-callback`;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// ** VERCEL ЭКСПОРТ **
module.exports = async (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    res.status(500).send('GOOGLE_CLIENT_ID is missing');
    return;
  }

  const state = generateRandomString(16);
  
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid profile email', 
      redirect_uri: REDIRECT_URI,
      state: state,
      access_type: 'online'
    }).toString();

  res.redirect(302, authUrl);
};