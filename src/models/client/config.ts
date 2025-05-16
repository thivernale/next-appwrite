import { Account, Avatars, Client, Databases, Storage } from 'appwrite';
import { environment } from '@/config/environment';

const client = new Client();
client
  .setEndpoint(environment.appwrite.endpointUrl)
  .setProject(environment.appwrite.projectId);

const account = new Account(client);
export { ID } from 'appwrite';

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export {
  account, avatars, databases, storage, client,
};
