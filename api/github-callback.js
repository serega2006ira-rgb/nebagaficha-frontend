// frontend/api/github-callback.js
// Обрабатывает колбэк от GitHub

const axios = require('axios');
const jwt = require('jsonwebtoken');

// *** АДРЕС ДЛЯ VERCEL ***
const VERCEL_DOMAIN = 'https://nebagaficha-frontend-ktv6.vercel.app';

// ** VERCEL ЭКСПОРТ **
module.exports = async (req, res) => {
    // В Vercel параметры запроса находятся в req.query
    const { code } = req.query; 

    if (!code) { 
        // Перенаправляем обратно на главную страницу в случае ошибки
        return res.redirect(302, VERCEL_DOMAIN); 
    }

    try {
        const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
        const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
        const JWT_SECRET = process.env.JWT_SECRET;
        
        // 1. Обмен кода на Access Token GitHub
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code: code },
            { headers: { Accept: 'application/json' } }
        );
        const { access_token } = tokenResponse.data;

        // 2. Получение данных пользователя GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${access_token}` }
        });
        const profile = userResponse.data;
        
        // 3. Генерация JWT-токена
        const payload = { id: profile.id, username: profile.login, provider: 'github' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // 4. Перенаправление на Frontend Vercel с токеном
        res.redirect(302, `${VERCEL_DOMAIN}/?token=${token}`);

    } catch (error) {
        console.error('GitHub Auth Failed:', error.message);
        res.redirect(302, `${VERCEL_DOMAIN}/?error=auth_failed`);
    }
};