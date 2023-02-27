export async function getGeolocation() {
  const navigatorGeolocation = await getGeolocationFromNavigator();
  if (navigatorGeolocation) return navigatorGeolocation;

  const ipGeolocation = await getGeolocationFromIp();
  if (ipGeolocation) return ipGeolocation;

  return undefined;
}

function getGeolocationFromIp() {
  return new Promise<IGeolocation | undefined>(async (resolve) => {
    try {
      const API_URL = 'http://ip-api.com/json';
      const resData = await fetch(API_URL).then((res) => res.json())
      const result: IGeolocation = {
        country: resData.country,
        countryCode: resData.countryCode,
        city: resData.city,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        latitude: resData.lat,
        longitude: resData.lon,
      }
      resolve(result);
    } catch (e: any) {
      resolve(undefined);
    }
  });
}

function getGeolocationFromNavigator() {
  return new Promise<IGeolocation | undefined>((resolve) => {
    if (!window.navigator.geolocation) {
      resolve(undefined);
      return;
    }
    window.navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        const data = await fetch(API_URL).then(res => res.json());
        const result: IGeolocation = {
          country: data.address.country,
          countryCode: data.address.country_code,
          city: data.address.city,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          latitude,
          longitude,
        }
        resolve(result);
      } catch (e: any) {
        resolve(undefined);
      }
    }, () => {
      resolve(undefined);
    });
  })
}

export interface IGeolocation {
  country: string;
  countryCode: string;
  city: string;
  timezone: string;

  latitude: number;
  longitude: number;
}