export class DatabaseError extends Error {}
export class FailedPrecondition extends Error {
  static NO_PREV_STATE =
    "Attempted to reuse transaction but previous state was not provided";
}
export class InvalidState extends DatabaseError {}
export class ItemDoesNotExist extends DatabaseError {
  constructor(item) {
    super(`Document ${item.uniqueName()} does not exist`);
  }
}
export function checkError(error, Error) {
  if (error instanceof Error) return;
  throw error;
}
