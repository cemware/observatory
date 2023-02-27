export function MJDToDate(mjd: number) {
  return new Date(Math.round((mjd + 2400000.5 - 2440587.5) * 86400000));
}

export function dateToMJD(date: Date) {
  return Number(date) / 86400000 - 2400000.5 + 2440587.5;
}