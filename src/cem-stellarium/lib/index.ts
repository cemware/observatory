import Stellarium from './stellarium-web-engine.js';
export default Stellarium;

export type StelObj = Record<string, any>;

export interface StellariumOriginal {
  core: StellariumCore;
  observer: StelObserver;
  canvas: HTMLCanvasElement;

  setFont(type: 'regular' | 'bold', url: string): void;
  pointAndLock(obj?: StelObj, duration?: number): void;
  onValueChanged(func: (a: any, b: any) => void): void;
  getObj(objName: string): StelObj | undefined;
  convertFrame(...args: any): any;
  c2s(...args: any): any;
  s2c(...args: any): any;
  anp(...args: any): any;
  anpm(...args: any): any;
  a2tf(a: number, b: number): { sign: number, hours: number, minutes: number, seconds: number, fraction: number };
  a2af(a: number, b: number): { sign: number, degrees: number, arcminutes: number, arcseconds: number, fraction: number };
  designationCleanup(name: string, flags?: any): string;
  otypeToStr(name: string): string;
  lookAt(pos: [number, number, number], duration: number): void;
  zoomTo(fovRad: number, duration: number): void;
  _core_on_mouse(id: any, type: number, dx: number, dy: number, dz: number): void;
}

export declare class StelModule {
  v: number;
  visible: boolean;
  addDataSource(props: { url: string, key?: string }): void;
}

export interface StellariumCore {
  id: number;
  path: string;
  icrs: number;
  observer: StelObserver;
  selection: StelObj | undefined | null | 0;
  lock: number | null;

  flip_view_horizontal: boolean;
  flip_view_vertical: boolean;
  exposure_scale: number;
  fov: number;
  fps: number;
  v: number;
  y_offset: number;
  zoom: number;
  time_speed: number;
  progressbars: ProgressBar[];

  skycultures: StelModule;
  stars: StelModule;
  landscapes: StelModule;
  milkyway: StelModule;
  dss: StelModule;
  dsos: StelModule;
  planets: StelModule;
  minor_planets: StelModule;
  comets: StelModule;
  satellites: StelModule;
  atmosphere: StelModule;
  lines: {
    meridian: StelModule;
    ecliptic: StelModule;

    azimuthal: StelModule;
    equatorial_jnow: StelModule;
  }

  getModule(moduleName: string): any;
  getObj(objName: string): any;
  createLayer(data: LayerData): any;
  createObj(type: string, args: any): any;
}

export interface LayerData {
  id: string;
  z: number;
  visible: boolean;
}

export interface StelObserver {
  azalt: number[];
  elevation: number;
  latitude: number;
  longitude: number;
  space: boolean;
  tt: number;
  utc: number;
  pitch: number;
  roll: number;
  yaw: number;
  v: number;
}

export interface ProgressBar {
  id: string;
  label: string;
  total: number;
  value: number;
}