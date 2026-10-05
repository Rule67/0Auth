import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createProductAction } from "@/app/actions";

// แสดงฟอร์มเพิ่มสินค้าให้ผู้ใช้ที่เข้าสู่ระบบแล้ว
export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="product-flow-page">
      <div className="product-flow-shell">
        <Link className="flow-back-link" href="/">
          กลับไปหน้าสินค้า
        </Link>
        <header className="flow-heading">
          <p className="flow-eyebrow">จัดการสินค้า</p>
          <h1>เพิ่มสินค้า</h1>
          <p>กรอกรายละเอียดสินค้าใหม่เพื่อเพิ่มลงในรายการ</p>
        </header>
        <form className="product-form" action={createProductAction}>
          <div className="form-field">
            <label htmlFor="name">ชื่อสินค้า</label>
            <input id="name" name="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="description">รายละเอียด</label>
            <textarea id="description" name="description" />
          </div>
          <div className="form-field">
            <label htmlFor="price">ราคา</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="category">หมวดหมู่</label>
            <input
              id="category"
              name="category"
              defaultValue="general"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="thumbnail">ลิงก์รูปภาพ (URL)</label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="url"
              maxLength={2048}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="form-actions">
            <button className="primary-action" type="submit">
              เพิ่มสินค้า
            </button>
            <Link className="secondary-action" href="/">
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
