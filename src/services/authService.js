import { ID } from "appwrite";
import { account } from "../appwrite/config";

const AUTH_UPDATED_EVENT = "homefix_auth_updated";

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export function userHasLabel(user, label) {
  return user?.labels?.includes(label) ?? false;
}

export async function registerUser({ name, email, password }) {
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });

  await account.createEmailPasswordSession({
    email,
    password,
  });

  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  return account.get();
}

export async function loginUser({ email, password }) {
  await account.createEmailPasswordSession({
    email,
    password,
  });

  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  return account.get();
}

export async function logoutUser() {
  await account.deleteSession({
    sessionId: "current",
  });

  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export function subscribeToAuthUpdates(callback) {
  window.addEventListener(AUTH_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(AUTH_UPDATED_EVENT, callback);
  };
}
