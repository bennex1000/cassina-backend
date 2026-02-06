import { db } from "../src/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    try {
        const sqlPath = path.join(__dirname, "../database/migrations/004_translate_items.sql");
        console.log(`Reading migration file: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, "utf-8");

        console.log("Executing SQL...");
        await db.query(sql);

        console.log("Migration applied successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

run();
