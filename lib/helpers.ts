// Generate all Sundays from April to December 2026
export function getSundays(): string[] {
  const sundays: string[] = [];
  const start = new Date(2026, 3, 1); // April 1, 2026
  const end = new Date(2026, 11, 31); // December 31, 2026

  const current = new Date(start);
  while (current.getDay() !== 0) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    sundays.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 7);
  }

  return sundays;
}

export function formatSunday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}
