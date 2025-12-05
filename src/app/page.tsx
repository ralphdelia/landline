// import { db } from "@/db";
// import { users } from "@/db/schema";
import Link from "next/link";

export default async function Home() {
  // const allUsers = await db.select().from(users);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center font-sans">
      <main className="bg-background flex min-h-screen w-full max-w-3xl flex-col items-center sm:items-start">
        <nav className="w-full">
          <Link className="text-lg font-bold hover:cursor-pointer" href={"/"}>
            The Landline Company
          </Link>
        </nav>
      </main>
    </div>
  );
}
