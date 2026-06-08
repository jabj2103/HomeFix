import { Account, Client, Storage, TablesDB } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const tablesDB = new TablesDB(client);
const storage = new Storage(client);
const account = new Account(client);

export { account, client, storage, tablesDB };

export const DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const TABLES = {
  products: import.meta.env.VITE_PRODUCTS_TABLE_ID,
  services: import.meta.env.VITE_SERVICES_TABLE_ID,
  serviceRequests:
    import.meta.env.VITE_SERVICE_REQUESTS_TABLE_ID,
  orders: import.meta.env.VITE_ORDERS_TABLE_ID,
};

export const BUCKETS = {
  products: import.meta.env.VITE_PRODUCTS_BUCKET_ID,
  services: import.meta.env.VITE_SERVICES_BUCKET_ID,
};
