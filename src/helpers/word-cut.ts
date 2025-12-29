export function truncateText(text: string, maxLength?: number): string {
  if(!text) return ""
  if(!maxLength) return text
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}