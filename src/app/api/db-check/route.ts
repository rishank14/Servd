import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
   try {
      const result = await db.execute(sql`SELECT 1 AS connected`);

      return NextResponse.json({
         success: true,
         database: "Neon PostgreSQL",
         result,
      });
   } catch (error) {
      console.error("Database connection failed:", error);

      return NextResponse.json(
         { success: false, error: "Database connection failed" },
         { status: 500 },
      );
   }
}
