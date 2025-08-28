export function moveDefaultAddressFirst<T extends { is_default?: boolean; isDefault?: boolean }>(
  addresses: T[]
): T[] {
  if (!addresses || addresses.length === 0) return addresses;

  return [...addresses].sort((a, b) => {
    const aDefault = a.is_default ?? a.isDefault ?? false;
    const bDefault = b.is_default ?? b.isDefault ?? false;

    return aDefault === bDefault ? 0 : aDefault ? -1 : 1;
  });
}
