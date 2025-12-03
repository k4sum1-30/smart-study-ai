// Vercel Serverless Function - Authentication
// File: api/auth.js

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { username, password } = req.body;

        // 简单认证 - 从环境变量读取账号密码
        const validUsername = process.env.APP_USERNAME || 'student';
        const validPassword = process.env.APP_PASSWORD || 'smartstudy2024';

        if (username === validUsername && password === validPassword) {
            // 生成简单的token（实际应用应使用JWT）
            const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

            return res.status(200).json({
                success: true,
                token,
                message: 'Login successful',
                user: {
                    username,
                    role: 'student'
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}
