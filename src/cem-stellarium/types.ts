import { ProgressBar } from "./lib";

export type Language = 'ko' | 'en';

export interface DataSourceUrlProvider {
  'stars-base': string;
  'stars-minimal': string;
  'stars-extended': string;
  'stars-gaia': string;

  'dso-base': string;
  'dso-extended': string;

  'etc-minor-planets': string;
  'etc-comets': string;
  'etc-satellites': string;

  'background-milkyway': string;
  'background-landscapes-guereins': string;
  'background-dss': string;

  'planet-callisto': string;
  'planet-default': string;
  'planet-europa': string;
  'planet-ganymede': string;
  'planet-io': string;
  'planet-jupiter': string;
  'planet-mars': string;
  'planet-mercury': string;
  'planet-moon': string;
  'planet-moon-normal': string;
  'planet-neptune': string;
  'planet-saturn': string;
  'planet-sun': string;
  'planet-uranus': string;
  'planet-venus': string;

  'skyculture-western': string;
}

export type EarthLocation = {
  latitude: number;
  longitude: number;
}

export type CemStellariumEvents = {
  ready(): void;
  afterLoad(): void;

  changeSelectObject(object?: SkyObject): void;
  changePitch(pitch: number): void;
  changeYaw(pitch: number): void;
  changeFov(fov: number): void;
  changeProgressBars(progresses: ProgressBar[]): void;
  changeTimeSpeed(timeSpeed: number): void;
  changeLockObject(objId: number): void;

  changeCurrentDateTime(dateTime: number): void;
  changeEarthLocation(earthLocation: EarthLocation): void;
  changeTimeSpeed(timeSpeed: number): void;

  changeVisibleAtmosphere(visible: boolean): void;
  changeVisibleLandscapes(visible: boolean): void;
  changeVisibleStars(visible: boolean): void;
  changeVisibleDSS(visible: boolean): void;
  changeVisibleDSO(visible: boolean): void;
  changeVisibleComets(visible: boolean): void;
  changeVisibleMilkyway(visible: boolean): void;
  changeVisibleMinorPlanets(visible: boolean): void;
  changeVisiblePlanets(visible: boolean): void;
  changeVisibleSatellites(visible: boolean): void;

  changeVisibleMeridianLine(visible: boolean): void;
  changeVisibleEclipticLine(visible: boolean): void;
  changeVisibleAzimuthalLine(visible: boolean): void;
  changeVisibleEquatorialLine(visible: boolean): void;
}

export interface SkyObject {
  id: number;
  type: string;
  types: string[];
  name: string;
  names: string[];
  magnitude: number;
  celestialCoordinates: { ra: number, dec: number };
  horizontalCoordinates: { az: number, alt: number };

  phase?: number;
  distance?: number;
  radius?: number;
  size?: [number, number];
  spectralType?: string;
  morpho?: string;
}