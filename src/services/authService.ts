import { account, ID } from '@/models/client/config';
import { Models } from 'appwrite';

export type RegisterType = { email: string; password: string; name: string };

export type LoginType = { email: string; password: string };

class AuthService {
  private static authService: AuthService;

  private constructor() {}

  public static newInstance() {
    if (!AuthService.authService) {
      AuthService.authService = new AuthService();
    }
    return AuthService.authService;
  }

  public async isUserLoggedIn() {
    return Boolean(await this.getCurrentUser());
  }

  public async getCurrentUser<T extends Models.Preferences>() {
    try {
      return await account.get<T>();
    } catch (e) {
      throw e;
    }
  }

  public async createUser({ email, password, name }: RegisterType, loginAfter = true) {
    try {
      const createdUser = await account.create(ID.unique(), email, password, name);
      if (createdUser && loginAfter) {
        return this.login({ email, password });
      } else {
        return createdUser;
      }
    } catch (e) {
      throw e;
    }
  }

  public async login({ email, password }: LoginType) {
    return await account.createEmailPasswordSession(email, password);
  }

  public async logout() {
    try {
      await account.deleteSession('current');
    } catch (e) {
      console.error(e);
    }
  }

  public async getCurrentSession() {
    return await account.getSession('current');
  }

  public async createJWT() {
    return await account.createJWT();
  }

  public async updatePrefs<T extends Models.Preferences>(prefs: T) {
    return await account.updatePrefs<T>(prefs);
  }
}

export const authService = AuthService.newInstance();
