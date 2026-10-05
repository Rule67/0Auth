"use server";

import { auth } from "@/auth";
import { createProduct, deleteProduct, updateProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ตรวจว่ามีผู้ใช้เข้าสู่ระบบก่อนอนุญาตให้จัดการสินค้า
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ตรวจสอบ URL รูปสินค้าให้เป็น HTTPS ที่ถูกต้อง หรือคืน null เมื่อเว้นว่าง
function getImageUrl(value: FormDataEntryValue | null): string | null {
  const imageUrl = String(value ?? "").trim();
  if (!imageUrl) {
    return null;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error("ลิงก์รูปภาพต้องเป็น URL HTTPS ที่ถูกต้อง");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !parsedUrl.hostname ||
    parsedUrl.username ||
    parsedUrl.password ||
    imageUrl.length > 2048
  ) {
    throw new Error("ลิงก์รูปภาพต้องเป็น URL HTTPS ที่ถูกต้อง");
  }

  return imageUrl;
}

// ตรวจข้อมูลและบันทึกการแก้ไขสินค้า จากนั้นอัปเดตหน้าแรกและกลับไปหน้ารายการ
export async function updateProductAction(id: string, formData: FormData) {
  // เติม: ฟังก์ชันที่ตรวจ session ซ้ำก่อนแก้ข้อมูล
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const thumbnail = getImageUrl(formData.get("thumbnail"));
  const price = Number(formData.get("price"));

  if (!name) {
    throw new Error("กรุณากรอกชื่อสินค้า");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  await updateProduct(id, { name, description, price, thumbnail });

  // เติม: ฟังก์ชันที่สั่งให้ Next ดึงข้อมูลหน้าแรกใหม่
  revalidatePath("/");
  redirect("/");
}

// ตรวจข้อมูลและสร้างสินค้าใหม่ จากนั้นอัปเดตหน้าแรกและกลับไปหน้ารายการ
export async function createProductAction(formData: FormData) {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "general";
  const thumbnail = getImageUrl(formData.get("thumbnail"));
  const price = Number(formData.get("price"));

  if (!name) {
    throw new Error("กรุณากรอกชื่อสินค้า");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  await createProduct({ name, description, price, category, thumbnail });
  revalidatePath("/");
  redirect("/");
}

// ลบสินค้าตามรหัส จากนั้นอัปเดตหน้าแรกและกลับไปหน้ารายการ
export async function deleteProductAction(id: string) {
  await requireUser();
  await deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}
