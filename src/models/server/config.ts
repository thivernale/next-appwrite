import { Account, Avatars, Client, Databases, Storage, Users } from 'node-appwrite';
import { environment } from '@/config/environment';

const client = new Client();
client
  .setEndpoint(environment.appwrite.endpointUrl)
  .setProject(environment.appwrite.projectId)
  .setKey(environment.appwrite.apiKey);

const account = new Account(client);
export { ID } from 'node-appwrite';

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { account, avatars, databases, storage, client, users };

export const delay = (durationMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
};
