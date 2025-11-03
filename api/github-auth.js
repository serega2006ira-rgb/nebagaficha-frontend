// frontend/api/github-auth.js
const { GITHUB_CLIENT_ID } = process.env;

// Адрес колбэка Vercel
const VERCEL_DOMAIN = 'https://nebagaficha-frontend-ktv6.vercel.app';
const REDIRECT_URI = `${VERCEL_DOMAIN}/api/github-callback`;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// ** ИСПРАВЛЕННЫЙ ЭКСПОРТ ДЛЯ VERCEL **
module.exports = async (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    // Используем стандартный объект ответа Vercel/Node.js
    res.status(500).send('GITHUB_CLIENT_ID is missing');
    return;
  }

  const state = generateRandomString(16);

  const authUrl = 'https://github.com/login/oauth/authorize?' +
    new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'user', 
      state: state,
    }).toString();

  // Используем стандартный объект ответа Vercel/Node.js
  res.redirect(302, authUrl);
};