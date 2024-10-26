export const hexToTailwind = (hex: string): string => {
  // This is a simplified version. In production, you'd want to map
  // the hex colors to the closest Tailwind color classes
  return `bg-[${hex}]`;
};