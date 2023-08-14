export class DatabaseError extends Error {}
export class InvalidState extends DatabaseError {}
export class ItemDoesNotExist extends DatabaseError {
  constructor(item) {
    super(`Document ${item.fullName()} does not exist`);
  }
}
export function checkError(error, Error) {
  if (error instanceof Error) return;
  throw error;
}
