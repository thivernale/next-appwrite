import { Account, Client } from 'appwrite';
import { environment } from '@/config/environment';

const client = new Client();
client
  .setEndpoint(environment.appwriteUrl)
  .setProject(environment.appwriteProjectId);

export const account = new Account(client);
export { ID } from 'appwrite';
