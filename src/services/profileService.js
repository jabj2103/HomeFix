import { Query } from "appwrite";
import { DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";

export async function getUserOrders(userId) {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLES.orders,
    queries: [Query.equal("userId", userId)],
  });

  return response.rows;
}

export async function getUserServiceRequests(userId) {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLES.serviceRequests,
    queries: [Query.equal("userId", userId)],
  });

  return response.rows;
}
