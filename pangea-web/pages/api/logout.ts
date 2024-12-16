import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { REFRESH_TOKEN, USE_SECURE_COOKIES } from './login';

export const clearRefreshToken = (cookies: Cookies) => {
  cookies.set(REFRESH_TOKEN, '', {
    httpOnly: true,
    expires: new Date(),
    overwrite: true,
    maxAge: 0,
    secure: USE_SECURE_COOKIES,
    sameSite: 'lax',
    path: '/',
  });
};

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookies = new Cookies(req, res);
    cookies.secure = USE_SECURE_COOKIES;
    clearRefreshToken(cookies);
    if (req.method === 'POST') {
      res.json({
        success: true,
      });
    } else {
      res.redirect('/');
    }
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};
export default logoutHandler;
