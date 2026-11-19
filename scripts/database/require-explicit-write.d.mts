export interface ExplicitDatabaseWriteOptions {
  operation: string;
  approvalVariable?: string;
}

export function requireExplicitDatabaseWrite(
  options: ExplicitDatabaseWriteOptions,
): string;
