import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export type { Product } from "@prisma/client";

// ดึงสินค้าทั้งหมดจากฐานข้อมูล โดยเรียงตามชื่อ
export async function fetchProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
  });
}

// ค้นหาสินค้ารายการเดียวด้วยรหัสสินค้า
export async function getProduct(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  });
}

// เพิ่มสินค้าใหม่ลงในฐานข้อมูล
export async function createProduct(
  product: Pick<
    Product,
    "name" | "description" | "price" | "category" | "thumbnail"
  >
): Promise<Product> {
  return prisma.product.create({
    data: product,
  });
}

// บันทึกการเปลี่ยนแปลงของสินค้าตามรหัส
export async function updateProduct(
  id: string,
  product: Pick<Product, "name" | "description" | "price" | "thumbnail">
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: product,
  });
}

// ลบสินค้าตามรหัสออกจากฐานข้อมูล
export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({
    where: { id },
  });
}
