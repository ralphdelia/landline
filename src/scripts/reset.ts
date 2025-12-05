import "dotenv/config";
import postgres from "postgres";

async function reset() {
  console.log("🗑️  Resetting database...");

  const client = postgres(process.env.DATABASE_URL!, { prepare: false });

  try {
    // Get all table names from public schema
    const tables = await client<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

    if (tables.length === 0) {
      console.log("✅ No tables found. Database is already empty.");
      return;
    }

    console.log(`📋 Found ${tables.length} table(s) to truncate:`);
    tables.forEach((t) => console.log(`   - ${t.tablename}`));

    // Truncate all tables dynamically
    for (const { tablename } of tables) {
      await client.unsafe(`TRUNCATE TABLE "${tablename}" CASCADE`);
      console.log(`   ✓ Truncated ${tablename}`);
    }

    console.log("✅ Database reset complete!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  } finally {
    await client.end();
  }
}

reset()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
