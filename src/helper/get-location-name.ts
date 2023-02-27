import throttle from "lodash.throttle";
import { Language } from "../cem-stellarium";

interface GetLocationNameProps {
  latitude: number;
  longitude: number;
  language?: Language;
}
export const getLocationName = throttle(async (props: GetLocationNameProps) => {
  const params = new URLSearchParams();
  params.set('lat', props.latitude.toFixed(7));
  params.set('lon', props.longitude.toFixed(7));
  params.set('format', 'json');
  params.set('addressdetails', '1');
  params.set('extratags', '1');
  params.set('namedetails', '1');
  params.set('zoom', '10');
  params.set('accept-language', props.language || 'ko');
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`).then((res) => res.json());

  if (res.error) return { error: true } as const;

  let result: string[] = [];
  if (res.address.country) {
    result.push(res.address.country);
  }
  if (res.address.city) {
    result.push(res.address.city);
  }
  if (res.address.borough) {
    result.push(res.address.borough);
  }

  if (!result.length) return { error: true } as const;

  if (props.language === 'ko') {
    return {
      error: false,
      data: result.join(' '),
    } as const
  }
  return {
    error: false,
    data: result.reverse().join(', '),
  } as const

}, 2000);