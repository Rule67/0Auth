import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { fetchProducts } from "@/lib/products";
import { AuthButtons } from "../components/auth-buttons";

export const dynamic = "force-dynamic";

// โหลดข้อมูลผู้ใช้และสินค้าจาก server แล้วแสดงหน้ารายการสินค้า
export default async function HomePage() {
  const session = await auth();
  const products = await fetchProducts();
  // เติม: ฟังก์ชันที่แปลงค่าเป็น true หรือ false
  const isLoggedIn = !!session?.user;

  return (
    <main className="store-page">
      <div className="store-shell">
        <header className="store-header">
          <Link className="store-wordmark" href="/">
            object<span>.</span>
          </Link>
          <p className="store-header-label">สินค้าและของใช้คัดสรร</p>
          <div className="store-account">
            <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
          </div>
        </header>

        <section className="store-intro" aria-labelledby="store-title">
          <p className="store-eyebrow">THE EVERYDAY EDIT</p>
          <h1 id="store-title">
            ของดีที่ทำให้
            <br />
            <span>ทุกวันพิเศษขึ้น</span>
          </h1>
          <div className="store-intro-bottom">
            <p>เลือกดูสินค้าชิ้นโปรดของคุณ จากคอลเลกชันที่เราคัดมาให้</p>
            <span className="store-count">
              {products.length.toString().padStart(2, "0")} รายการ
            </span>
          </div>
        </section>

        <section className="store-catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <h2 id="catalog-title">เลือกชมสินค้า</h2>
            <div className="catalog-heading-actions">
              {isLoggedIn && (
                <Link className="catalog-add-link" href="/products/new">
                  เพิ่มสินค้า
                </Link>
              )}
              <span>เรียงตามชื่อ</span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                  data-testid="product"
                >
                  <div className="product-image-wrap">
                    {product.thumbnail && (
                      <Image
                        className="product-image"
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 560px) 42vw, (max-width: 800px) 48vw, 33vw"
                        loading="lazy"
                      />
                    )}
                    <span className="product-category">{product.category}</span>
                  </div>
                  <div className="product-details">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <p className="product-price">
                        ฿{product.price.toLocaleString("th-TH")}
                      </p>
                    </div>
                    {product.description && (
                      <p className="product-description">
                        {product.description}
                      </p>
                    )}
                    {isLoggedIn && (
                      <div className="product-actions">
                        <Link href={`/products/${product.id}/edit`}>แก้ไข</Link>
                        <Link href={`/products/${product.id}/delete`}>ลบสินค้า</Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-products">ยังไม่มีสินค้าในรายการ</p>
          )}
        </section>
      </div>
    </main>
  );
}
