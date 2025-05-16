export const environment = {
  appwrite: {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_URL as string,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
    apiKey: process.env.APPWRITE_API_KEY as string,
  },
};
