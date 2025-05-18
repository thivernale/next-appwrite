import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AppwriteException, Models } from 'appwrite';
import { authService, LoginType, RegisterType } from '@/services/authService';

export interface UserPreferences {
  reputation: number;
}

type AuthState = {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPreferences> | null;
  hydrated: boolean;
};

type AuthActions = {
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(l: LoginType): Promise<AppwriteResult>;
  createUser(r: RegisterType): Promise<AppwriteResult>;
  logout(): Promise<void>;
};

type AppwriteResult = {
  success: boolean;
  error?: AppwriteException | null;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      immer(
        // persist stateCreatorFn
        (set) => ({
          session: null,
          jwt: null,
          user: null,
          hydrated: false,

          setHydrated() {
            set({ hydrated: true });
          },

          async verifySession(): Promise<void> {
            try {
              const session = await authService.getCurrentSession();
              set({ session });
            } catch (e) {
              console.log(e);
            }
          },

          async login({ email, password }): Promise<AppwriteResult> {
            try {
              const session = await authService.login({ email, password });
              const [user, { jwt }] = await Promise.all([
                authService.getCurrentUser<UserPreferences>(),
                authService.createJWT(),
              ]);

              if (!user.prefs.reputation) {
                await authService.updatePrefs<UserPreferences>({
                  ...user.prefs,
                  reputation: 0,
                });
              }

              set({ session, user, jwt });

              return {
                success: true,
              };
            } catch (e) {
              return {
                success: false,
                error: e instanceof AppwriteException ? e : null,
              };
            }
          },

          async createUser({ email, password, name }): Promise<AppwriteResult> {
            try {
              await authService.createUser({ email, password, name }, false);

              return {
                success: true,
              };
            } catch (e) {
              return {
                success: false,
                error: e instanceof AppwriteException ? e : null,
              };
            }
          },

          async logout(): Promise<void> {
            await authService.logout();
            set({ session: null, user: null, jwt: null });
          },
        }),
      ),
      // persistOptions
      {
        name: 'authStore',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => {
          console.log('hydration starts');

          // optional
          return (state, error) => {
            if (error) {
              console.log('an error happened during hydration', error);
            } else {
              state?.setHydrated();
              console.log('hydration finished');
            }
          };
        },
      },
    ),
  ),
);
