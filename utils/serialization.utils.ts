export default function transformObjectForSerialization<
  P = unknown,
  T = unknown
>(obj: P, seen: WeakSet<object> = new WeakSet()): T {
  // Usamos 'any' como tipo de retorno, ya que es difícil definir un tipo preciso
  if (typeof obj === "bigint") {
    return obj.toString() as T;
  } else if (obj instanceof Date) {
    return obj.toISOString() as T;
  } else if (obj instanceof Map) {
    return {
      type: "Map",
      value: Array.from(obj.entries()).map(([key, value]) => [
        transformObjectForSerialization(key, seen),
        transformObjectForSerialization(value, seen),
      ]),
    } as T;
  } else if (obj instanceof Set) {
    return {
      type: "Set",
      value: Array.from(obj).map((item) =>
        transformObjectForSerialization(item, seen)
      ),
    } as T;
  } else if (obj === null || typeof obj !== "object") {
    return obj as unknown as T;
  }

  // Evitar bucles infinitos por referencias circulares
  if (seen.has(obj)) {
    return "[Circular Reference]" as T;
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectForSerialization(item, seen)) as T;
  } else {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        transformObjectForSerialization(value, seen),
      ])
    ) as T;
  }
}
