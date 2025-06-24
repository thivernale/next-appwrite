'use server';

import { users } from '@/models/server/config';
import { UserPreferences } from '@/store/Auth';
import { Models } from 'appwrite';

export async function updateAuthorReputation(userId: string, reputationDelta: number) {
  const prefs = await users.getPrefs<UserPreferences>(userId);

  return await users.updatePrefs<UserPreferences>(userId, {
    ...prefs,
    reputation: Number(prefs.reputation ?? 0) + reputationDelta,
  });
}

export async function getUser<T extends Models.Preferences>(userId: string) {
  return users.get<T>(userId);
}
