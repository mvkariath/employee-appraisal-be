function sanitize<T extends object>(obj: T, excludeKeys: string[] = []): T {
  const clone = { ...obj };
  for (const key of excludeKeys) {
    delete (clone as any)[key];
  }
  return clone;
}

function diffArrayById<T extends { id?: number }>(
  existing: T[],
  incoming: T[],
  excludeFields: string[] = [
    "createdAt",
    "updatedAt",
    "deletedAt",
    "submittedAt",
  ]
): {
  toCreate: T[];
  toUpdate: T[];
  toDelete: number[];
} {
  const existingMap = new Map<number, T>();
  const toCreate: T[] = [];
  const toUpdate: T[] = [];

  for (const item of existing) {
    if (item.id !== undefined) {
      existingMap.set(item.id, item);
    }
  }

  for (const incomingItem of incoming) {
    if (incomingItem.id && existingMap.has(incomingItem.id)) {
      const existingItem = existingMap.get(incomingItem.id)!;
      const sanitizedExisting = sanitize(existingItem, excludeFields);
      const sanitizedIncoming = sanitize(incomingItem, excludeFields);

      if (
        JSON.stringify(sanitizedExisting) !== JSON.stringify(sanitizedIncoming)
      ) {
        toUpdate.push(incomingItem);
      }
      existingMap.delete(incomingItem.id);
    } else {
      toCreate.push(incomingItem);
    }
  }

  const toDelete = Array.from(existingMap.keys());

  return { toCreate, toUpdate, toDelete };
}
export default diffArrayById;
