import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
  const allUsers = await db.select().from(users);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center bg-background sm:items-start">
        <div className="bg-stone-100 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            Database Connection Test
          </h1>
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Users in Database ({allUsers.length})
            </h2>
            {allUsers.length === 0 ? (
              <p className="text-muted-foreground">
                No users found. Database connection is working, but the table is
                empty.
              </p>
            ) : (
              <ul className="space-y-2">
                {allUsers.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 rounded border border-border bg-muted"
                  >
                    <div className="font-medium text-foreground">
                      {user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
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
