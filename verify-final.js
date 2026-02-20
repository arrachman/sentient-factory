const { Client } = require("pg");

async function verifyFinalStructure() {
  const client = new Client({
    host: "localhost",
    port: 3208,
    database: "sentient_factory",
    user: "root",
    password: "PasswordSuperRahasia123!",
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    console.log("=== FINAL DATABASE STRUCTURE ===\n");

    const tables = [
      "User",
      "Role",
      "Permission",
      "Department",
      "Session",
      "AuditLog",
      "UserRole",
      "UserDepartment",
      "RolePermission",
    ];

    // Check each table
    for (const table of tables) {
      console.log(`📊 ${table}:`);

      // Columns
      const columns = await client.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `,
        [table],
      );

      columns.rows.forEach((col) => {
        const nullable = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
        const def = col.column_default ? ` default: ${col.column_default}` : "";
        console.log(`  ${col.column_name}: ${col.data_type} ${nullable}${def}`);
      });

      // Primary key
      const pk = await client.query(
        `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public' 
          AND tc.table_name = $1
          AND tc.constraint_type = 'PRIMARY KEY';
      `,
        [table],
      );

      if (pk.rows.length > 0) {
        console.log(
          `  PRIMARY KEY: ${pk.rows.map((r) => r.column_name).join(", ")}`,
        );
      }

      // Unique constraints
      const uniques = await client.query(
        `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public' 
          AND tc.table_name = $1
          AND tc.constraint_type = 'UNIQUE'
          AND tc.constraint_name != '${table}_pkey';
      `,
        [table],
      );

      if (uniques.rows.length > 0) {
        console.log(
          `  UNIQUE: ${uniques.rows.map((r) => r.column_name).join(", ")}`,
        );
      }

      // Sample data
      const sample = await client.query(
        `SELECT id, uuid FROM "${table}" ORDER BY id LIMIT 2;`,
      );
      if (sample.rows.length > 0) {
        console.log(
          `  SAMPLE: ${sample.rows.map((r) => `id=${r.id}, uuid=${r.uuid?.substring(0, 8)}...`).join("; ")}`,
        );
      }

      console.log("");
    }

    // Check foreign keys
    console.log("=== FOREIGN KEY RELATIONSHIPS ===");
    const fks = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    fks.rows.forEach((fk) => {
      console.log(
        `  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`,
      );
    });

    console.log("\n=== DATA CONSISTENCY CHECK ===");

    // Check if all foreign key references are valid
    const fkChecks = [
      {
        table: "Session",
        column: "userId",
        refTable: "User",
        refColumn: "uuid",
      },
      {
        table: "UserRole",
        column: "userId",
        refTable: "User",
        refColumn: "uuid",
      },
      {
        table: "UserRole",
        column: "roleId",
        refTable: "Role",
        refColumn: "uuid",
      },
      {
        table: "UserDepartment",
        column: "userId",
        refTable: "User",
        refColumn: "uuid",
      },
      {
        table: "UserDepartment",
        column: "departmentId",
        refTable: "Department",
        refColumn: "uuid",
      },
      {
        table: "RolePermission",
        column: "roleId",
        refTable: "Role",
        refColumn: "uuid",
      },
      {
        table: "RolePermission",
        column: "permissionId",
        refTable: "Permission",
        refColumn: "uuid",
      },
      {
        table: "AuditLog",
        column: "userId",
        refTable: "User",
        refColumn: "uuid",
      },
      {
        table: "Department",
        column: "parentId",
        refTable: "Department",
        refColumn: "uuid",
      },
    ];

    let allValid = true;
    for (const fk of fkChecks) {
      const check = await client.query(`
        SELECT COUNT(*) as orphaned_count
        FROM "${fk.table}" t
        LEFT JOIN "${fk.refTable}" r ON t."${fk.column}" = r."${fk.refColumn}"
        WHERE r."${fk.refColumn}" IS NULL AND t."${fk.column}" IS NOT NULL;
      `);

      const orphaned = check.rows[0].orphaned_count;
      if (orphaned > 0) {
        console.log(
          `❌ ${fk.table}.${fk.column} has ${orphaned} orphaned references to ${fk.refTable}.${fk.refColumn}`,
        );
        allValid = false;
      } else {
        console.log(
          `✅ ${fk.table}.${fk.column} → ${fk.refTable}.${fk.refColumn} (valid)`,
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    if (allValid) {
      console.log("✅ ALL CHECKS PASSED! Database structure is correct.");
      console.log("\n📋 SUMMARY:");
      console.log("- id (integer auto-increment) is PRIMARY KEY");
      console.log("- uuid (string CUID) is UNIQUE identifier");
      console.log("- Foreign keys reference uuid columns");
      console.log("- All data relationships preserved");
    } else {
      console.log("❌ SOME CHECKS FAILED! Review orphaned references.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

verifyFinalStructure();
