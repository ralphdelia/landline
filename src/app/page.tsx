import Image from "next/image";
import { db } from "@/db";
import { users } from "@/db/schema";

// Force dynamic rendering - don't prerender at build time
export const dynamic = "force-dynamic";

export default async function Home() {
  // Query all users from the database
  const allUsers = await db.select().from(users);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Database Connection Test
          </h1>
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
              Users in Database ({allUsers.length})
            </h2>
            {allUsers.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No users found. Database connection is working, but the table is
                empty.
              </p>
            ) : (
              <ul className="space-y-2">
                {allUsers.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                  >
                    <div className="font-medium text-black dark:text-zinc-50">
                      {user.name}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
