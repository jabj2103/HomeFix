import { BUCKETS, DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";
import { getItemImageUrl } from "./imageService";

export async function getProducts() {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLES.products,
  });

  return response.rows.map((product) => ({
    ...product,
    imageSrc: getItemImageUrl(product, BUCKETS.products),
  }));
}
