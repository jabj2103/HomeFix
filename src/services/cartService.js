const CART_STORAGE_KEY = "homefix_cart";
const CART_UPDATED_EVENT = "homefix_cart_updated";

export function getCartItems() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addToCart(product) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.id === product.$id);

  if (existingItem) {
    const updatedItems = items.map((item) =>
      item.id === product.$id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    saveCartItems(updatedItems);
    return updatedItems;
  }

  const updatedItems = [
    ...items,
    {
      id: product.$id,
      name: product.name,
      price: Number(product.price) || 0,
      imageSrc: product.imageSrc,
      category:
        product.category?.name ||
        product.categoryName ||
        product.category_name ||
        product.category ||
        product.categoria?.name ||
        product.categoriaNombre ||
        product.categoria ||
        "",
      quantity: 1,
    },
  ];

  saveCartItems(updatedItems);
  return updatedItems;
}

export function updateCartItemQuantity(productId, quantity) {
  const nextQuantity = Math.max(1, quantity);
  const updatedItems = getCartItems().map((item) =>
    item.id === productId ? { ...item, quantity: nextQuantity } : item
  );

  saveCartItems(updatedItems);
  return updatedItems;
}

export function removeCartItem(productId) {
  const updatedItems = getCartItems().filter((item) => item.id !== productId);

  saveCartItems(updatedItems);
  return updatedItems;
}

export function getCartItemsCount(items = getCartItems()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function subscribeToCartUpdates(callback) {
  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
