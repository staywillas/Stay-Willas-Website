/**
 * Require a deliberate, environment-specific opt-in before a maintenance
 * script writes to PostgreSQL. This helper never prints the connection URL.
 */
export function requireExplicitDatabaseWrite({
  operation,
  approvalVariable = "ALLOW_DATABASE_MUTATIONS",
}) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(`${operation}: DATABASE_URL is not configured.`);
  }

  let databaseName;
  try {
    databaseName = decodeURIComponent(
      new URL(connectionString).pathname.split("/").filter(Boolean).at(-1) ?? "",
    );
  } catch {
    throw new Error(`${operation}: DATABASE_URL is not a valid PostgreSQL URL.`);
  }

  if (!databaseName) {
    throw new Error(`${operation}: DATABASE_URL must include a database name.`);
  }

  if (process.env.ALLOW_DATABASE_MUTATIONS !== "YES") {
    throw new Error(
      `${operation}: refused. Set ALLOW_DATABASE_MUTATIONS=YES after reviewing the target database.`,
    );
  }

  if (approvalVariable !== "ALLOW_DATABASE_MUTATIONS" && process.env[approvalVariable] !== "YES") {
    throw new Error(`${operation}: refused. Set ${approvalVariable}=YES to confirm this operation.`);
  }

  if (process.env.CONFIRM_DATABASE_NAME !== databaseName) {
    throw new Error(
      `${operation}: refused. Set CONFIRM_DATABASE_NAME to the exact database name (${databaseName}) after verifying the target.`,
    );
  }

  if (
    (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") &&
    process.env.ALLOW_PRODUCTION_DATABASE_WRITES !== "YES"
  ) {
    throw new Error(
      `${operation}: production database writes require ALLOW_PRODUCTION_DATABASE_WRITES=YES.`,
    );
  }

  return databaseName;
}
