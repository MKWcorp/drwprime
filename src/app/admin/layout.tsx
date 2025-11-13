import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-dark">
      <AdminNavbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
