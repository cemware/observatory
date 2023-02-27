import dayjs from "dayjs";
import { CemStellarium } from "@/cem-stellarium";
import { MJDToDate } from "@/helper/dates";

export function formatDate(mjd: number) {
  const date = MJDToDate(mjd);
  return dayjs(date).format('HH:mm:ss')
}

export function formatInt(i: number, len = 2) {
  return i.toFixed(0).padStart(len, '0');
}

export function formatRA(cemStellarium: CemStellarium, ra: number) {
  const {
    sign, hours, minutes, seconds, fraction
  } = cemStellarium.engine.a2tf(ra, 1);
  return [
    { value: formatInt(hours), unit: 'h' },
    { value: formatInt(minutes), unit: 'm' },
    { value: formatInt(seconds) + '.' + fraction, unit: 's' },
  ];
}

export function formatAz(cemStellarium: CemStellarium, az: number) {
  const {
    sign, degrees, arcminutes, arcseconds, fraction
  } = cemStellarium.engine.a2af(az, 1);
  return [
    { value: formatInt(degrees < 0 ? degrees + 180 : degrees, 3), unit: '°' },
    { value: formatInt(arcminutes), unit: '\'' },
    { value: formatInt(arcseconds) + '.' + fraction, unit: '"' },
  ];
}

export function formatDec(cemStellarium: CemStellarium, dec: number) {
  const {
    sign, degrees, arcminutes, arcseconds, fraction
  } = cemStellarium.engine.a2af(dec, 1);
  return [
    { value: sign + formatInt(degrees), unit: '°' },
    { value: formatInt(arcminutes), unit: '\'' },
    { value: formatInt(arcseconds) + '.' + fraction, unit: '"' },
  ];
}

const ERFA_AULT = 499.004782;
const ERFA_DAYSEC = 86400.0;
const ERFA_DJY = 365.25;
const ERFA_DAU = 149597870000;

export function formatDistance(d: number) {
  if (!d) {
    return { value: NaN, unit: '' } as const
  }
  const ly = d * ERFA_AULT / ERFA_DAYSEC / ERFA_DJY;
  if (ly >= 0.1) {
    return { value: ly, unit: 'LY' } as const;
  }
  if (d >= 0.1) {
    return { value: d, unit: 'AU' } as const;
  }
  const meter = d * ERFA_DAU;
  if (meter >= 1000) {
    return { value: meter / 1000, unit: 'km' } as const;
  }
  return { value: meter, unit: 'm' } as const;
}

export function formatGalaxyMorpho(morpho?: string) {
  if (!morpho) return '';
  const galTab = {
    E: 'Elliptical Galaxy',
    SB: 'Barred Spiral Galaxy',
    SAB: 'Intermediate Spiral Galaxy',
    SA: 'Normality Spiral Galaxy',
    S0: 'Lenticular Galaxy',
    S: 'Spiral Galaxy',
    Im: 'Irregular Galaxy',
    dSph: 'Dwarf Spheroidal Galaxy',
    dE: 'Dwarf Elliptical Galaxy',
  }
  for (const morp in galTab) {
    if (morpho.startsWith(morp)) {
      return galTab[morp as keyof typeof galTab];
    }
  }
  return '';
}