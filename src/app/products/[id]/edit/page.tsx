import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateProductAction } from "@/app/actions";
import { getProduct } from "@/lib/products";

type EditProductPageProps = {
	params: Promise<{ id: string }>;
};

// ตรวจสิทธิ์ โหลดสินค้าตามรหัส แล้วแสดงฟอร์มแก้ไขข้อมูล
export default async function EditProductPage({
	params,
}: EditProductPageProps) {
	const session = await auth();
	if (!session?.user) {
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

	const updateAction = updateProductAction.bind(null, product.id);

	return (
		<main className="product-flow-page">
			<div className="product-flow-shell">
				<Link className="flow-back-link" href="/">
					กลับไปหน้าสินค้า
				</Link>
				<header className="flow-heading">
					<p className="flow-eyebrow">จัดการสินค้า</p>
					<h1>แก้ไขสินค้า</h1>
					<p>ปรับรายละเอียดให้ตรงกับข้อมูลล่าสุด</p>
				</header>
				<form className="product-form" action={updateAction}>
					<div className="form-field">
					<label htmlFor="name">ชื่อสินค้า</label>
					<input
						id="name"
						name="name"
						defaultValue={product.name}
						required
					/>
					</div>
					<div className="form-field">
					<label htmlFor="description">รายละเอียด</label>
					<textarea
						id="description"
						name="description"
						defaultValue={product.description ?? ""}
					/>
					</div>
					<div className="form-field">
					<label htmlFor="price">ราคา</label>
					<input
						id="price"
						name="price"
						type="number"
						min="0"
						step="0.01"
						defaultValue={product.price}
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
						defaultValue={product.thumbnail ?? ""}
					/>
					</div>
					<div className="form-actions">
						<button className="primary-action" type="submit">
							บันทึกการเปลี่ยนแปลง
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
