import { ID } from "appwrite";
import { DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";

export async function createOrder({ user, items, total }) {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLES.orders,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      total,
      status: "Pendiente",
      paymentMethod: "PayU",
      items: JSON.stringify(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        }))
      ),
    },
  });
}
