/* ─── CSV export helpers (used by every admin panel section) ─── */

/** Turn any value into a safe CSV cell (arrays joined, objects JSON'd, quotes escaped). */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let s: string
  if (Array.isArray(value)) s = value.join(' | ')
  else if (value instanceof Date) s = value.toISOString()
  else if (typeof value === 'object') s = JSON.stringify(value)
  else s = String(value)
  // Wrap in quotes when the cell contains a comma, quote or newline.
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
  return s
}

/** Build a CSV string from row objects (columns = union of keys in first-seen order). */
export function toCsv(rows: readonly object[]): string {
  const recs = rows as Record<string, unknown>[]
  if (!recs.length) return ''
  const columns: string[] = []
  for (const row of recs) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) columns.push(key)
    }
  }
  const lines = [columns.map(csvCell).join(',')]
  for (const row of recs) {
    lines.push(columns.map(c => csvCell(row[c])).join(','))
  }
  return lines.join('\r\n')
}

/** Download rows as a CSV file in the browser (BOM included so Excel opens UTF-8 correctly). */
export function downloadCsv(filename: string, rows: readonly object[]): void {
  const csv = toCsv(rows)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
