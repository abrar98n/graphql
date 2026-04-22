export function formatXP(num) {
  if (num >= 1000) {
    return Math.round(num / 1000) + " KB";
  }
  return num + " B";
}