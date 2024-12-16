import { Mutex, withTimeout } from 'async-mutex';
import axios, { isAxiosError } from 'axios';
import { env } from 'process';
import {
  PangeaMFAFirstStepJWTMFAEnabledSuccessResponse,
  PangeaTokenObtainPairResponse,
} from '../lib/api/v2/data-contracts';
import { Api } from './api/v2/Api';
import { PangeaMFAJWTAccessRefreshResponse } from './api/v2/data-contracts';
import {
  PangeaDefaultAxiosConfig,
  PangeaSessionCV,
  apiHelper,
} from './apiHelpers';
import { UserState } from './enums';
import { SubscribeEvent, UserStateType } from './types';
import { parseBoolean /*, safeWindow*/ } from './utils';

abstract class AuthHelper {
  public static parseJwt = (
    token: string,
  ): { iat: number; exp: number; user_id: number } => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const base64Buffer = Buffer.from(base64, 'base64');
    const base64A: number[] = [];
    base64Buffer.forEach((val) => base64A.push(val));
    const jsonPayloadA = decodeURIComponent(
      base64A.map((c) => '%' + ('00' + c.toString(16)).slice(-2)).join(''),
    );
    return JSON.parse(jsonPayloadA);
  };

  public abstract logInWithPasswordAsync(
    username: string,
    password: string,
  ): Promise<
    | PangeaMFAFirstStepJWTMFAEnabledSuccessResponse
    | PangeaMFAJWTAccessRefreshResponse
  >;

  abstract refreshTokenAsync(
    token: Nullable<PangeaTokenObtainPairResponse>,
  ): Promise<PangeaTokenObtainPairResponse>;

  public static isExpired = (token: Optional<Nullable<string>>): boolean => {
    if (!token) return true;
    const tokenDates = AuthHelper.getTokenDates(token);
    const now = AuthHelper.getNow();
    return now >= tokenDates.exp;
  };

  public static isNearExpiry = (token: Optional<Nullable<string>>): boolean => {
    if (!token) {
      return true;
    }

    const tokenDates = AuthHelper.getTokenDates(token);
    const secondsTillExpiry = AuthHelper.secondsUntilExpiry(token);
    return !tokenDates || secondsTillExpiry <= 60;
  };

  abstract logoutAsync(): Promise<void>;

  protected static getNow = (): number => {
    return Math.floor(Number(new Date()) / 1000);
  };

  protected static getTokenDates = (
    token: string,
  ): { iat: number; exp: number } => {
    const parsedData = AuthHelper.parseJwt(token);
    return { exp: Number(parsedData.exp), iat: Number(parsedData.iat) };
  };

  protected static secondsUntilExpiry = (token: string): number => {
    const parsedJwt = AuthHelper.getTokenDates(token);
    const now = AuthHelper.getNow();
    return Math.floor(parsedJwt.exp - now);
  };

  protected static dateFromNum = (fileTime: number): Date => {
    return new Date(fileTime * 1000);
  };
}
export class ServerAuthHelper extends AuthHelper {
  protected loginApi: Api<PangeaTokenObtainPairResponse>;
  constructor() {
    super();
    this.loginApi = new Api<PangeaTokenObtainPairResponse>(
      PangeaDefaultAxiosConfig,
    );
  }

  public async logoutAsync() {
    throw 'not implemented';
  }

  public async logInWithPasswordAsync(
    email: string,
    password: string,
  ): Promise<
    | PangeaMFAFirstStepJWTMFAEnabledSuccessResponse
    | PangeaMFAJWTAccessRefreshResponse
  > {
    const tokenData = await this.loginApi.authLoginCreate({
      username: email,
      password,
    });
    if (tokenData.status >= 400) {
      throw 'Login failed.';
    }

    return tokenData.data;
  }

  public async verifyTokenAsync(accessToken: string): Promise<boolean> {
    try {
      const response = await this.loginApi.tokenVerifyCreate({
        token: accessToken,
      });
      return !isAxiosError(response);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public override async refreshTokenAsync(
    token: Nullable<PangeaTokenObtainPairResponse>,
  ): Promise<PangeaTokenObtainPairResponse> {
    if (!token) {
      throw 'No token provided.';
    }

    if (AuthHelper.isExpired(token.refresh)) {
      throw 'Refresh token expired';
    }

    const tokenData = await this.loginApi.tokenRefreshCreate(token);
    if (tokenData.status > 400) {
      throw 'Login failed!';
    }

    if (!!tokenData && tokenData.data.access) {
      const newToken = { ...token, access: tokenData.data.access };
      return newToken;
    }

    return token;
  }
}

type LoginResponseProps = PangeaTokenObtainPairResponse & {
  state?: UserState;
  method?: string;
  ephemeral_token?: string;
  data?: any;
};
export class ClientAuthHelper extends AuthHelper {
  private readonly DEFAULT_RESPONSE = { access: '', refresh: '' };
  private tokenData: Nullable<LoginResponseProps>;
  private static instance: ClientAuthHelper;
  private consecutiveFailedLoginAttempts = 0;
  public isAttemptingGetToken = false;
  public onLoggedIn = new SubscribeEvent<boolean>();
  private logonMutex = withTimeout(new Mutex(), 5000);
  private constructor() {
    super();
    this.tokenData = null;
  }
  public static getInstance(): ClientAuthHelper {
    if (!ClientAuthHelper.instance) {
      ClientAuthHelper.instance = new ClientAuthHelper();
    }
    return ClientAuthHelper.instance;
  }
  public getTokenData(): Nullable<LoginResponseProps> {
    if (env.NODE_ENV !== 'production') {
      return this.tokenData;
    }
    if (!this.tokenData) {
      return null;
    }

    return { ...this.tokenData, access: '', refresh: '' };
  }
  public getUserId(): Nullable<number> {
    if (!this.tokenData) {
      return null;
    }
    return AuthHelper.parseJwt(this.tokenData.access).user_id;
  }
  private async _logInInternalAsync(
    username?: string,
    password?: string,
    refresh = false,
    code?: PangeaMFAJWTAccessRefreshResponse,
    isTokenAutoLogin = false,
  ): Promise<LoginResponseProps> {
    const body =
      !refresh && !isTokenAutoLogin
        ? {
            username,
            password,
            code,
          }
        : isTokenAutoLogin
        ? { token: code }
        : null;
    this.isAttemptingGetToken = true;
    return await axios
      .post('/api/login', body)
      .then(
        (resp) => {
          this.consecutiveFailedLoginAttempts = 0;
          if (resp.status == 200 && parseBoolean(resp.data.success)) {
            const { accessToken: access, ...rest } = resp.data;
            const response = { access, refresh: '', ...rest };
            this.tokenData = response;
            return response;
          }
          return this.DEFAULT_RESPONSE;
        },
        async (reason) => {
          this.consecutiveFailedLoginAttempts++;
          console.warn('Got Axios Error', reason);
          if (this.consecutiveFailedLoginAttempts > 5) {
            await this.logoutAsync();
          }
          return this.DEFAULT_RESPONSE;
        },
      )
      .catch(async (reason) => {
        console.error('Error calling Login', reason);
        await this.logoutAsync();
        return this.DEFAULT_RESPONSE;
      })
      .finally(() => {
        this.isAttemptingGetToken = false;
      });
  }
  public async logInWithPasswordAsync(
    username?: string,
    password?: string,
    refresh = false,
  ): Promise<LoginResponseProps> {
    try {
      await this.logonMutex.waitForUnlock();
    } catch {
      return this.DEFAULT_RESPONSE;
    }
    const releaseMutex = await this.logonMutex.acquire();
    try {
      if (refresh && this.tokenData && !this.tokenIsNearExpiry()) {
        return this.tokenData;
      }

      const response = await this._logInInternalAsync(
        username,
        password,
        refresh,
      );
      this.onLoggedIn.fire(!AuthHelper.isExpired(response.access));
      return response;
    } catch {
      return this.DEFAULT_RESPONSE;
    } finally {
      releaseMutex();
    }
  }

  public async logInWithCodeAsync(
    code: PangeaMFAJWTAccessRefreshResponse,
    refresh = false,
    isTokenAutoLogin = false,
  ): Promise<LoginResponseProps> {
    try {
      await this.logonMutex.waitForUnlock();
    } catch {
      return this.DEFAULT_RESPONSE;
    }
    const releaseMutex = await this.logonMutex.acquire();
    try {
      if (refresh && this.tokenData && !this.tokenIsNearExpiry()) {
        return this.tokenData;
      }
      const response = await this._logInInternalAsync(
        '',
        '',
        false,
        code,
        isTokenAutoLogin,
      );
      this.onLoggedIn.fire(!AuthHelper.isExpired(response.access));
      return response;
    } catch {
      return this.DEFAULT_RESPONSE;
    } finally {
      releaseMutex();
    }
  }
  public override async refreshTokenAsync(): Promise<PangeaTokenObtainPairResponse> {
    if (this.tokenData && !this.tokenIsNearExpiry()) {
      return this.tokenData;
    }
    const refreshTokenResponse = await this.logInWithPasswordAsync(
      undefined,
      undefined,
      true,
    );
    if (!AuthHelper.isExpired(refreshTokenResponse.access)) {
      this.tokenData = refreshTokenResponse;
      return refreshTokenResponse;
    }

    return this.DEFAULT_RESPONSE;
  }
  public async logoutAsync(): Promise<void> {
    await axios
      .post('/api/logout')
      .catch((e) => {
        console.warn('error logging out', e);
      })
      .finally(() => {
        this.tokenData = null;
        this.consecutiveFailedLoginAttempts = 0;
        this.onLoggedIn.fire(false);
      });
  }

  public tokenIsNearExpiry(): boolean {
    return ClientAuthHelper.isNearExpiry(this.tokenData?.access);
  }

  public tokenIsExpired(): boolean {
    return ClientAuthHelper.isExpired(this.tokenData?.access);
  }

  public async getUserStatusAsync(): Promise<UserStateType> {
    try {
      const userStatus = await axios.post('/api/userstatus', undefined, {
        headers: {
          Authorization: 'Bearer ' + this.tokenData?.access,
          'x-pangea-cv': PangeaSessionCV,
        },
      });
      return userStatus.data as UserStateType;
    } catch {
      return { state: UserState.NotActive, data: { cta: '/login' } };
    }
  }

  private getAuthenticatedApi(
    tokenOverride?: PangeaTokenObtainPairResponse,
  ): Api<PangeaTokenObtainPairResponse> {
    const api = new Api({
      ...PangeaDefaultAxiosConfig,
      securityWorker: async (
        tokenData: Nullable<PangeaTokenObtainPairResponse>,
      ) => {
        if (!tokenData || ClientAuthHelper.isNearExpiry(tokenData.access)) {
          tokenData = await this.refreshTokenAsync();
          this.tokenData = tokenData;
        }
        return {
          headers: {
            Authorization:
              !tokenData?.access || ClientAuthHelper.isExpired(tokenData.access)
                ? ''
                : `Bearer ${tokenData.access}`,
            'x-pangea-cv': PangeaSessionCV,
          },
        };
      },
    });

    api.setSecurityData(tokenOverride ? tokenOverride : this.tokenData);
    return api;
  }

  private getUnauthenticatedApi(): Api<PangeaTokenObtainPairResponse> {
    return new Api(PangeaDefaultAxiosConfig);
  }

  public getAuthenticatedApiHelper(
    tokenOverride?: PangeaTokenObtainPairResponse,
  ) {
    return apiHelper(this.getAuthenticatedApi(tokenOverride));
  }

  public getUnauthenticatedApiHelper() {
    return apiHelper(this.getUnauthenticatedApi());
  }
}
