/**
 * Format objek Date native menjadi string ISO 'YYYY-MM-DD'.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Geser tanggal jika jatuh pada hari Minggu (depot tutup).
 * 0 = Minggu di JS Date.
 */
export function adjustForDepotHoliday(date: Date): Date {
  const copy = new Date(date);
  if (copy.getDay() === 0) {
    copy.setDate(copy.getDate() + 1); // Geser ke Senin
  }
  return copy;
}

/**
 * Generate deretan tanggal jadwal pengantaran berkala.
 */
export function generateDeliveryDates(
  startDate: string | Date,
  intervalDays: number,
  occurrences: number = 4
): string[] {
  if (intervalDays <= 0) {
    throw new Error('intervalDays harus lebih besar dari 0');
  }
  if (occurrences <= 0) {
    throw new Error('occurrences harus lebih besar dari 0');
  }

  const results: string[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < occurrences; i++) {
    const validDate = adjustForDepotHoliday(current);
    results.push(formatDate(validDate));
    current.setDate(current.getDate() + intervalDays);
  }

  return results;
}
