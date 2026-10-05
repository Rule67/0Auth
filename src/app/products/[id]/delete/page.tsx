import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

// ตรวจสิทธิ์และแสดงรายละเอียดสินค้าเพื่อยืนยันก่อนลบ
export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    // เติม: ฟังก์ชันที่พาผู้ที่ยังไม่ล็อกอินกลับหน้าแรก
    redirect("/");
  }

  const { id: rawId } = await params;
  if (!rawId) {
    notFound();
  }

  const product = await getProduct(rawId);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="product-flow-page">
      <div className="product-flow-shell">
        <Link className="flow-back-link" href="/">
          กลับไปหน้าสินค้า
        </Link>
        <section className="delete-panel" aria-labelledby="delete-title">
          <p className="flow-eyebrow">จัดการสินค้า</p>
          <h1 id="delete-title">ยืนยันการลบ</h1>
          <p className="delete-message">
            สินค้านี้จะถูกนำออกจากรายการ คุณสามารถยกเลิกได้ก่อนยืนยัน
          </p>
          <div className="delete-product-summary">
            <div className="delete-product-image">
              {product.thumbnail && (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="96px"
                />
              )}
            </div>
            <div className="delete-product-info">
              <span>{product.category}</span>
              <h2>{product.name}</h2>
            </div>
            <p className="product-price">
              ฿{product.price.toLocaleString("th-TH")}
            </p>
          </div>
          <div className="delete-actions">
            <form action={deleteAction}>
              <button className="destructive-action" type="submit">
                ลบสินค้า
              </button>
            </form>
            <Link className="secondary-action" href="/">
              ยกเลิก
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
