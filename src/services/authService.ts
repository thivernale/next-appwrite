import { account, ID } from '@/models/client/config';

export type RegisterType = { email: string; password: string, name: string };

export type LoginType = { email: string; password: string };

class AuthService {
  private static authService: AuthService;

  private constructor() {
  }

  public static newInstance() {
    if (!AuthService.authService) {
      AuthService.authService = new AuthService();
    }
    return AuthService.authService;
  }

  public async isUserLoggedIn() {
    return Boolean(await this.getCurrentUser());
  };

  public async getCurrentUser() {
    try {
      return await account.get();
    } catch (e) {
      throw e;
    }
  }

  public async createUser({ email, password, name }: RegisterType) {
    try {
      const createdUser = await account.create(ID.unique(), email, password, name);
      if (createdUser) {
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
}

export const authService = AuthService.newInstance();
