"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * Helper function to get the current user ID
 */
async function getCurrentUserId() {
  const session = await getSession();
  if (session && session.userId) {
    return session.userId as number;
  }
  return null;
}

/**
 * Get or create the user's cart
 */
export async function getOrCreateCart() {
  const userId = await getCurrentUserId();
  
  // We'll require login for cart to simplify
  // If no user, return null and handle in UI
  if (!userId) {
    return null;
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              }
            }
          }
        }
      }
    });
  }

  return cart;
}

/**
 * Get the current cart (without creating if not exists)
 */
export async function getCartAction() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    // Next.js Server Actions cannot serialize Prisma.Decimal automatically.
    // We must map over the items and ensure "price" is a standard Number.
    const serializedCart = {
      ...cart,
      items: cart!.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price.toNumber ? item.product.price.toNumber() : Number(item.product.price)
        }
      }))
    };

    return { success: true, data: serializedCart };
  } catch (error) {
    console.error("Failed to get cart:", error);
    return { success: false, error: "Gagal mengambil keranjang" };
  }
}

/**
 * Add a product to the cart or increment its quantity
 */
export async function addToCartAction(productId: number, quantity: number = 1) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Silakan masuk (login) untuk menambahkan ke keranjang" };
  }

  try {
    const cart = await getOrCreateCart();
    if (!cart) {
      return { success: false, error: "Gagal membuat keranjang" };
    }

    // Check if the item is already in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      }
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }

    revalidatePath("/catalog");
    revalidatePath("/");
    
    return { success: true, message: "Berhasil ditambahkan ke keranjang" };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { success: false, error: "Gagal menambahkan produk ke keranjang" };
  }
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartItemQuantityAction(itemId: number, newQuantity: number) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Verify the item belongs to the user's cart
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!item || item.cart.userId !== userId) {
      return { success: false, error: "Item not found or unauthorized" };
    }

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId }
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      });
    }

    revalidatePath("/catalog");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return { success: false, error: "Gagal memperbarui kuantitas" };
  }
}

/**
 * Remove an item from the cart
 */
export async function removeFromCartAction(itemId: number) {
  return updateCartItemQuantityAction(itemId, 0);
}
