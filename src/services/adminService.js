import { Query } from "appwrite";
import { DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";
import { getProducts } from "./productService";

const ADMIN_LIST_LIMIT = 100;

async function listTableRows(tableId) {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId,
    queries: [Query.limit(ADMIN_LIST_LIMIT)],
  });

  return response.rows;
}

export function getAdminOrders() {
  return listTableRows(TABLES.orders);
}

export function getAdminServiceRequests() {
  return listTableRows(TABLES.serviceRequests);
}

export function getAdminProducts() {
  return getProducts([Query.limit(ADMIN_LIST_LIMIT)]);
}

export function updateOrderStatus(rowId, status) {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLES.orders,
    rowId,
    data: { status },
  });
}

export function updateServiceRequestStatus(rowId, status) {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLES.serviceRequests,
    rowId,
    data: { status },
  });
}
