import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // เติม: provider ของ Google ที่ import มาด้านบน
  providers: [Google],
  callbacks: {
    // อนุญาตให้เข้าเส้นทางจัดการสินค้าได้เฉพาะผู้ใช้ที่เข้าสู่ระบบ
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isProductManagementPage =
        pathname === "/products/new" ||
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);
      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }
      return true;
    },
  },
});
