import { DataSourceUrlProvider } from "@/cem-stellarium";

const BASE_URL = 'https://files.steamup.academy/skydata';

export const wasmFile = '/wasm/stellarium-web-engine.wasm';
export const dataSource: Partial<DataSourceUrlProvider> = {
  'stars-base': BASE_URL + '/stars-base',
  'stars-minimal': BASE_URL + '/stars-minimal',
  'stars-extended': BASE_URL + '/stars-extended',
  'stars-gaia': BASE_URL + '/stars-gaia',
  'dso-base': BASE_URL + '/dsos-base',
  'dso-extended': BASE_URL + '/dsos-extended',
  'etc-comets': BASE_URL + '/comets.txt',
  'etc-minor-planets': BASE_URL + '/minor-planets.dat',
  'etc-satellites': BASE_URL + '/satellite.jsonl.gz',
  'background-landscapes-guereins': BASE_URL + '/images-landscapes-guereins',
  'background-milkyway': BASE_URL + '/images-milkyway',
  'background-dss': BASE_URL + '/images-dss',
  'planet-callisto': BASE_URL + '/images-planet-callisto',
  'planet-default': BASE_URL + '/images-planet-default',
  'planet-europa': BASE_URL + '/images-planet-europa',
  'planet-ganymede': BASE_URL + '/images-planet-ganymede',
  'planet-io': BASE_URL + '/images-planet-io',
  'planet-jupiter': BASE_URL + '/images-planet-jupiter',
  'planet-mars': BASE_URL + '/images-planet-mars',
  'planet-mercury': BASE_URL + '/images-planet-mercury',
  'planet-moon': BASE_URL + '/images-planet-moon',
  'planet-neptune': BASE_URL + '/images-planet-neptune',
  'planet-saturn': BASE_URL + '/images-planet-saturn',
  'planet-sun': BASE_URL + '/images-planet-sun',
  'planet-uranus': BASE_URL + '/images-planet-uranus',
  'planet-venus': BASE_URL + '/images-planet-venus',
  'skyculture-western': BASE_URL + '/skyculture-western',
}