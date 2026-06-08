import { ID, Permission, Role } from "appwrite";
import { BUCKETS, DATABASE_ID, TABLES, tablesDB } from "../appwrite/config";
import { getItemImageUrl } from "./imageService";

export async function getServices() {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLES.services,
  });

  return response.rows.map((service) => ({
    ...service,
    imageSrc: getItemImageUrl(
      service,
      BUCKETS.services || BUCKETS.products
    ),
  }));
}

export async function createServiceRequest(service, formData) {
  const preferredDate = new Date(
    `${formData.preferredDate}T12:00:00`
  ).toISOString();

  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLES.serviceRequests,
    rowId: ID.unique(),
    data: {
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      serviceType: service.name,
      address: formData.address,
      description: formData.problemDescription,
      preferredDate,
      timeSlot: formData.timeSlot,
      urgency: formData.urgency,
      status: "Pendiente",
    },
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ],
  });
}
