import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    }));
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}