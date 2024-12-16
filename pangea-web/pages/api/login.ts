import Cookies from 'cookies';
import { addHours } from 'date-fns';
import {
  ClientAuthHelper,
  PangeaMFAFirstStepJWTMFAEnabledSuccessResponse,
  PangeaMFAJWTAccessRefreshResponse,
  PangeaTokenObtainPairResponse,
  parseBoolean,
  ServerAuthHelper,
  UserState,
} from 'lib';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { clearRefreshToken } from './logout';
import { getUserStatusWithCtaAsync } from './userstatus';

export const REFRESH_TOKEN = 'refresh_token';
export const USE_SECURE_COOKIES: boolean = env.USE_SECURE_COOKIES
  ? parseBoolean(env.USE_SECURE_COOKIES)
  : env.NODE_ENV === 'production';
const getRefreshTokenCookie = (
  cookies: Cookies,
): Nullable<PangeaTokenObtainPairResponse> => {
  const refreshToken = cookies.get(REFRESH_TOKEN);
  if (refreshToken) {
    return { refresh: `${refreshToken}`, access: '' };
  } else {
    return null;
  }
};

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    let authResult: Nullable<
      | PangeaMFAFirstStepJWTMFAEnabledSuccessResponse
      | PangeaMFAJWTAccessRefreshResponse
    > = null;
    const cookies = new Cookies(req, res);
    cookies.secure = USE_SECURE_COOKIES;
    const authHelper = new ServerAuthHelper();
    const refreshTokenFromCookie = getRefreshTokenCookie(cookies);
    let loginWithPassword = false;
    try {
      if (req.body.code != undefined) {
        console.debug(req.body, 'requesting access token from code');
        authResult = await authHelper.refreshTokenAsync(req.body.code);
      } else if (req.body.token != undefined) {
        console.debug(
          'logging in with access token from token',
          req.body.token,
        );
        const tokenLoginResponse: {
          success: boolean;
          accessToken: string;
          userState?: UserState;
          data?: {
            cta: string;
          };
        } = {
          success: true,
          accessToken: req.body.token.access /*user information*/,
        };
        const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper({
          access: req.body.token.access,
          refresh: 'not used',
        });
        const userState = await getUserStatusWithCtaAsync(api);
        tokenLoginResponse.userState = userState.state;
        tokenLoginResponse.data = userState.data;
        res.status(200).send(tokenLoginResponse);
        return;
      } else if (
        (!req.body ||
          req.body == undefined ||
          req.body == null ||
          !req.body.username ||
          req.body.username == '') &&
        !!refreshTokenFromCookie
      ) {
        console.debug('getting access token from refresh token');
        authResult = await authHelper.refreshTokenAsync(refreshTokenFromCookie);
      } else if (!!req?.body?.username && !!req?.body?.password) {
        console.debug('logging in with password');
        try {
          loginWithPassword = true;
          authResult = await authHelper.logInWithPasswordAsync(
            req.body.username,
            req.body.password,
          );
        } catch {
          console.error('login failed - returning 401');
          clearRefreshToken(cookies);
          res.status(401).json({ success: false, reason: 'login failed' });
          return;
        }
      } else {
        res.status(200).json({ success: false });
        return;
      }

      cookies.set(
        REFRESH_TOKEN,
        (authResult as PangeaMFAJWTAccessRefreshResponse).refresh,
        {
          httpOnly: true,
          expires: addHours(new Date(), 23),
          overwrite: true,
          maxAge: 23 * 60 * 60 * 1000,
          secure: USE_SECURE_COOKIES,
          sameSite: 'lax',
          path: '/',
        },
      );
      const responsePayload: {
        success: boolean;
        accessToken: string;
        method: string;
        userState?: UserState;
        ephemeral_token?: string;
        data?: {
          cta: string;
        };
      } = {
        success: true,
        accessToken: (authResult as PangeaMFAJWTAccessRefreshResponse)
          .access /*user information*/,
        method: (authResult as PangeaMFAFirstStepJWTMFAEnabledSuccessResponse)
          .method,
        ephemeral_token: (
          authResult as PangeaMFAFirstStepJWTMFAEnabledSuccessResponse
        ).ephemeral_token,
      };
      if (loginWithPassword) {
        const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper({
          access: (authResult as PangeaMFAJWTAccessRefreshResponse).access,
          refresh: 'not used',
        });
        const userState = await getUserStatusWithCtaAsync(api);
        responsePayload.userState = userState.state;
        responsePayload.data = userState.data;
      }

      res.status(200).send(responsePayload);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
      return;
    }
  } else {
    res.redirect('/');
  }
};
export default loginHandler;
