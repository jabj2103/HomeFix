import { ID } from "appwrite";
import { DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";

export function getOrderDetails(order) {
  try {
    const storedData = JSON.parse(order.items || "[]");

    if (Array.isArray(storedData)) {
      return {
        products: storedData,
        delivery: null,
      };
    }

    return {
      products: storedData.products || [],
      delivery: storedData.delivery || null,
    };
  } catch {
    return {
      products: [],
      delivery: null,
    };
  }
}

export async function createOrder({ user, items, total, delivery }) {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLES.orders,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      total,
      status: "Pendiente",
      paymentMethod: "PayU",
      items: JSON.stringify({
        products: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        delivery,
      }),
    },
  });
}
