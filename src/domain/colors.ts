export const PROJECT_COLORS = [
  'red', 'orange', 'yellow', 'green', 'mint', 'teal',
  'cyan', 'blue', 'purple', 'pink', 'gray', 'brown',
] as const

export type ProjectColor = (typeof PROJECT_COLORS)[number]

export function isValidColor(color: string): color is ProjectColor {
  return (PROJECT_COLORS as readonly string[]).includes(color)
}
