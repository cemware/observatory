import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import throttle from "lodash.throttle";
import Stellarium, { StellariumOriginal } from "./lib";
import { CemStellariumEvents, DataSourceUrlProvider, SkyObject } from "./types";
import { getGeolocation, IGeolocation } from "../helper/get-geolocation";
import planets from "./data/planets";
import { dateToMJD, MJDToDate } from "../helper/dates";
import { degreeToRadian, radianToDegree } from "../helper/math";
import { IS_DEV, VERSION } from "../env";
import { timeSleep } from "../helper/time-sleep";
import { Geometry } from "./geometry";


type i18nNS = 'gui' | 'sky';
interface CemStellariumCreationProps {
  wasmFile: string;
  canvas: HTMLCanvasElement;
  font?: { regular?: string, bold?: string };
  dataSource?: Partial<DataSourceUrlProvider>;
  translateFn?: (namespace: i18nNS, text: string) => string;
}

export class CemStellarium {
  static version = VERSION;

  public engine: StellariumOriginal;

  public geometry: Geometry;

  public eventManager = new EventEmitter() as TypedEmitter<CemStellariumEvents>;

  static create(props: CemStellariumCreationProps) {
    return new Promise<CemStellarium>((resolve) => {
      Stellarium({
        canvas: props.canvas,
        wasmFile: props.wasmFile,
        translateFn: props.translateFn,
        async onReady(engine: StellariumOriginal) {
          if (props.dataSource) {
            addDataSource(engine, props.dataSource);
          }
          const cemStellarium = new CemStellarium(engine);
          engine.setFont('regular', props.font?.regular || '/font/NotoSansKR-Regular.otf');
          engine.setFont('bold', props.font?.bold || '/font/NotoSansKR-Bold.otf');
          engine.core.atmosphere.visible = false;

          resolve(cemStellarium);

          if (IS_DEV) console.log(engine);

          await timeSleep(1000);
          cemStellarium.eventManager.emit('ready');
          cemStellarium.eventManager.emit('changeSelectObject');
          cemStellarium.eventManager.emit('changePitch', engine.core.observer.pitch);
          cemStellarium.eventManager.emit('changeYaw', engine.core.observer.yaw);
          cemStellarium.eventManager.emit('changeFov', engine.core.fov);
          cemStellarium.eventManager.emit('changeLockObject', engine.core.lock ?? 0);

          cemStellarium.eventManager.emit('changeCurrentDateTime', MJDToDate(engine.core.observer.utc).getTime());
          cemStellarium.eventManager.emit('changeEarthLocation', {
            latitude: radianToDegree(engine.core.observer.latitude),
            longitude: radianToDegree(engine.core.observer.longitude),
          });
          cemStellarium.eventManager.emit('changeTimeSpeed', engine.core.time_speed);

          cemStellarium.eventManager.emit('changeVisibleAtmosphere', engine.core.atmosphere.visible);
          cemStellarium.eventManager.emit('changeVisibleLandscapes', engine.core.comets.visible);
          cemStellarium.eventManager.emit('changeVisibleStars', engine.core.stars.visible);
          cemStellarium.eventManager.emit('changeVisibleDSS', engine.core.dss.visible);
          cemStellarium.eventManager.emit('changeVisibleDSO', engine.core.dsos.visible);
          cemStellarium.eventManager.emit('changeVisibleComets', engine.core.comets.visible);
          cemStellarium.eventManager.emit('changeVisibleMilkyway', engine.core.milkyway.visible);
          cemStellarium.eventManager.emit('changeVisibleMinorPlanets', engine.core.minor_planets.visible);
          cemStellarium.eventManager.emit('changeVisiblePlanets', engine.core.planets.visible);
          cemStellarium.eventManager.emit('changeVisibleSatellites', engine.core.satellites.visible);

          cemStellarium.eventManager.emit('changeVisibleEclipticLine', engine.core.lines.ecliptic.visible);
          cemStellarium.eventManager.emit('changeVisibleMeridianLine', engine.core.lines.meridian.visible);
          cemStellarium.eventManager.emit('changeVisibleAzimuthalLine', engine.core.lines.azimuthal.visible);
          cemStellarium.eventManager.emit('changeVisibleEquatorialLine', engine.core.lines.equatorial_jnow.visible);

        }
      });
    })
  }

  private constructor(engine: StellariumOriginal) {
    this.engine = engine;
    this.geometry = new Geometry(this.engine);
    this.handleEvents();
    this.setGeoLocation();

    this.engine.core.time_speed = 1;
    this.engine.canvas.tabIndex = -1;
    this.engine.canvas.addEventListener('keydown', this.onKeyDownCanvas.bind(this));

    const resize = throttle(this.resize.bind(this), 1000);
    window.addEventListener('resize', resize);
    if (this.engine.canvas.parentElement) {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(this.engine.canvas.parentElement);
    }
  }

  public setVisibleAtmosphere(visible?: boolean) {
    this.engine.core.atmosphere.visible = visible ?? !this.engine.core.atmosphere.visible;
  }
  public setVisibleLandscapes(visible?: boolean) {
    this.engine.core.landscapes.visible = visible ?? !this.engine.core.landscapes.visible;
  }
  public setVisibleStars(visible?: boolean) {
    this.engine.core.stars.visible = visible ?? !this.engine.core.stars.visible;
  }
  public setVisibleDSS(visible?: boolean) {
    this.engine.core.dss.visible = visible ?? !this.engine.core.dss.visible;
  }
  public setVisibleDSOs(visible?: boolean) {
    this.engine.core.dsos.visible = visible ?? !this.engine.core.dsos.visible;
  }
  public setVisibleComets(visible?: boolean) {
    this.engine.core.comets.visible = visible ?? !this.engine.core.comets.visible;
  }
  public setVisibleMilkyway(visible?: boolean) {
    this.engine.core.milkyway.visible = visible ?? !this.engine.core.milkyway.visible;
  }
  public setVisibleMinorPlanets(visible?: boolean) {
    this.engine.core.minor_planets.visible = visible ?? !this.engine.core.minor_planets.visible;
  }
  public setVisiblePlanets(visible?: boolean) {
    this.engine.core.planets.visible = visible ?? !this.engine.core.planets.visible;
  }
  public setVisibleSatellites(visible?: boolean) {
    this.engine.core.satellites.visible = visible ?? !this.engine.core.satellites.visible;
  }
  public setVisibleEclipticLine(visible?: boolean) {
    this.engine.core.lines.ecliptic.visible = visible ?? !this.engine.core.lines.ecliptic.visible;
  }
  public setVisibleMeridianLine(visible?: boolean) {
    this.engine.core.lines.meridian.visible = visible ?? !this.engine.core.lines.meridian.visible;
  }
  public setVisibleAzimuthalLine(visible?: boolean) {
    this.engine.core.lines.azimuthal.visible = visible ?? !this.engine.core.lines.azimuthal.visible;
  }
  public setVisibleEquatorialLine(visible?: boolean) {
    this.engine.core.lines.equatorial_jnow.visible = visible ?? !this.engine.core.lines.equatorial_jnow.visible;
  }

  public pointAndLockSelectionObj(duration = 0.5) {
    const obj = this.engine.core.selection;
    if (obj) {
      this.engine.pointAndLock(obj, duration);
    }
  }

  public getSelectedSkyObject() {
    const obj = this.engine.core.selection;
    if (!obj) return undefined;

    return this.swobjToSkyObject(obj);
  }

  get currentDateTime() {
    return MJDToDate(this.engine.core.observer.utc).getTime();
  }
  set currentDateTime(dateTime: number) {
    this.engine.core.observer.utc = dateToMJD(new Date(dateTime));
  }

  public async setGeoLocation(location?: Partial<IGeolocation>) {
    if (!location) {
      location = await getGeolocation();
      if (!location) return;
    }
    if (location.latitude !== undefined) {
      this.engine.core.observer.latitude = degreeToRadian(location.latitude);
    }
    if (location.longitude !== undefined) {
      this.engine.core.observer.longitude = degreeToRadian(location.longitude);
    }
  }

  public setTimeSpeed(timeSpeed = 0) {
    this.engine.core.time_speed = timeSpeed;
  }

  public increaseTimeSpeed() {
    const ts = this.engine.core.time_speed;
    const dir = Math.sign(ts);
    const arg = Math.log2(Math.abs(ts));
    const MAX_ARG = 20;
    if (dir * arg >= MAX_ARG) return;
    if (ts === -1 || ts === 0) {
      this.setTimeSpeed(1);
    } else {
      this.setTimeSpeed(dir * (2 ** (arg + dir)));
    }
  }

  public decreaseTimeSpeed() {
    const ts = this.engine.core.time_speed;
    const dir = Math.sign(ts);
    const arg = Math.log2(Math.abs(ts));
    const MIN_ARG = -20;
    if (dir * arg <= MIN_ARG) return;
    if (ts === 1 || ts === 0) {
      this.setTimeSpeed(-1);
    } else {
      this.setTimeSpeed(dir * (2 ** (arg - dir)));
    }
  }

  public setCameraViewByAzAlt(azRad: number, altRad: number, duration = 0) {
    const pos = this.engine.s2c(azRad, altRad);
    this.engine.lookAt(pos, duration);
  }

  public setCameraViewByRaDec(raRad: number, decRad: number, duration = 0) {
    const pos = this.engine.s2c(raRad, decRad);
    const radecPos = this.engine.convertFrame(this.engine.core.observer, 'JNOW', 'OBSERVED', pos);
    this.engine.lookAt(radecPos, duration);
  }

  public zoomIn() {
    const fovDeg = radianToDegree(this.engine.core.fov);
    const fovRad = degreeToRadian(fovDeg / 1.03);
    this.engine.zoomTo(fovRad, 0);
  }

  public zoomOut() {
    const fovDeg = radianToDegree(this.engine.core.fov);
    const fovRad = degreeToRadian(fovDeg * 1.03);
    this.engine.zoomTo(fovRad, 0);
  }

  public save() {
    const core = this.engine.core;
    const saveData = {
      version: CemStellarium.version,
      observer: {
        latitude: core.observer.latitude,
        longitude: core.observer.longitude,
        elevation: core.observer.elevation,
        pitch: core.observer.pitch,
        roll: core.observer.roll,
        yaw: core.observer.yaw,
        utc: core.observer.utc,
      },
      fov: core.fov,
      timeSpeed: core.time_speed,
      visibilities: {
        atmosphere: core.atmosphere.visible,
        comets: core.comets.visible,
        dsos: core.dsos.visible,
        dss: core.dss.visible,
        landscapes: core.landscapes.visible,
        milkyway: core.milkyway.visible,
        minorPlanets: core.minor_planets.visible,
        planets: core.planets.visible,
        satellites: core.satellites.visible,
        stars: core.stars.visible,
        eclipticLine: core.lines.ecliptic.visible,
        meridianLine: core.lines.meridian.visible,
        azimuthalLine: core.lines.azimuthal.visible,
        equatorialLine: core.lines.equatorial_jnow.visible,
      },
    } as const;
    return saveData;
  }

  public load(data: ReturnType<CemStellarium['save']>) {
    this.engine.core.selection = undefined;
    this.engine.core.observer.latitude = data.observer.latitude;
    this.engine.core.observer.longitude = data.observer.longitude;
    this.engine.core.observer.elevation = data.observer.elevation;
    this.engine.core.observer.pitch = data.observer.pitch;
    this.engine.core.observer.roll = data.observer.roll;
    this.engine.core.observer.yaw = data.observer.yaw;
    this.engine.core.observer.utc = data.observer.utc;
    this.engine.core.fov = data.fov;
    this.engine.core.time_speed = data.timeSpeed;
    this.engine.core.atmosphere.visible = data.visibilities.atmosphere;
    this.engine.core.comets.visible = data.visibilities.comets;
    this.engine.core.dsos.visible = data.visibilities.dsos;
    this.engine.core.dss.visible = data.visibilities.dss;
    this.engine.core.landscapes.visible = data.visibilities.landscapes;
    this.engine.core.milkyway.visible = data.visibilities.milkyway;
    this.engine.core.minor_planets.visible = data.visibilities.minorPlanets;
    this.engine.core.planets.visible = data.visibilities.planets;
    this.engine.core.satellites.visible = data.visibilities.satellites;
    this.engine.core.stars.visible = data.visibilities.stars;
    this.engine.core.lines.ecliptic.visible = data.visibilities.eclipticLine;
    this.engine.core.lines.meridian.visible = data.visibilities.meridianLine;
    this.engine.core.lines.azimuthal.visible = data.visibilities.azimuthalLine;
    this.engine.core.lines.equatorial_jnow.visible = data.visibilities.equatorialLine;

    this.eventManager.emit('afterLoad');
    console.log('load')
  }

  public getAllObjects() {
    const stars = this.getObjectList('stars', 6);
    const planets = this.getObjectList('planets', 6);
    const dsos = this.getObjectList('dsos', 8);
    const comets = this.getObjectList('comets', 6);
    const satellites = this.getObjectList('satellites', 6);
    return new Map([...stars, ...planets, ...dsos, ...comets, ...satellites]);
  }

  public getStelObjectByName(name: string) {

    let obj = this.engine.getObj(name);
    if (!obj) {
      const otherName = this.getAllObjects().get(name.toLowerCase());
      if (otherName) {
        obj = this.engine.getObj(otherName);
      }
    }
    if (obj) return obj;
    return undefined;
  }

  public getSkyObjectByName(name: string) {
    const obj = this.getStelObjectByName(name);
    if (obj) {
      return this.swobjToSkyObject(obj);
    }
    return undefined;
  }

  private getObjectList(module: string, maxMag = 6) {
    const engine = this.engine as any
    const objIds: any[] = [];
    const callback = engine.addFunction((user: any, obj: any) => {
      objIds.push(obj);
      return 0;
    }, 'iii');
    engine._module_list_objs2(engine.core[module]?.v, engine.core.observer.v, maxMag, 0, callback);
    const result = new Map<string, string>();
    for (let i = 0; i < objIds.length; i++) {
      try {
        const obj = new engine.SweObj(objIds[i]);
        const name = this.engine.designationCleanup(obj.id).toLowerCase();
        if (name) {
          result.set(name, obj.id);
        }
      } catch (e: any) { }
    }
    return result;
  }

  private resize() {
    const canvas = this.engine.canvas;
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }

  private onKeyDownCanvas(e: KeyboardEvent) {
    const key = e.key.toUpperCase();
    const VELOCITY = degreeToRadian(2) * this.engine.core.fov;

    switch (key) {

      case 'ARROWLEFT':
        this.engine.core.observer.yaw -= VELOCITY; break;
      case 'ARROWRIGHT':
        this.engine.core.observer.yaw += VELOCITY; break;
      case 'ARROWUP': {
        const nextPitch = this.engine.core.observer.pitch + VELOCITY;
        if (nextPitch <= degreeToRadian(90)) this.engine.core.observer.pitch = nextPitch;
        break;
      }
      case 'ARROWDOWN': {
        const nextPitch = this.engine.core.observer.pitch - VELOCITY;
        if (nextPitch >= degreeToRadian(-90)) this.engine.core.observer.pitch = nextPitch;
        break;
      }

      case '-':
      case '_': this.zoomOut(); break;
      case '+':
      case '=': this.zoomIn(); break;

    }
  }

  private handleEvents() {
    this.engine.onValueChanged((path: string, payload: any) => {

      switch (path) {
        case 'selection': this.eventManager.emit('changeSelectObject', this.getSelectedSkyObject()); break;
        case 'observer.utc': this.eventManager.emit('changeCurrentDateTime', MJDToDate(payload).getTime()); break;
        case 'time_speed': this.eventManager.emit('changeTimeSpeed', payload); break;
        case 'observer.pitch': this.eventManager.emit('changePitch', payload); break;
        case 'observer.yaw': this.eventManager.emit('changeYaw', payload); break;
        case 'observer.latitude':
        case 'observer.longitude': this.eventManager.emit('changeEarthLocation', {
          latitude: radianToDegree(this.engine.core.observer.latitude),
          longitude: radianToDegree(this.engine.core.observer.longitude),
        }); break;
        case 'fov': this.eventManager.emit('changeFov', payload); break;
        case 'progressbars': this.eventManager.emit('changeProgressBars', payload); break;
        case 'lock': this.eventManager.emit('changeLockObject', payload); break;
        case 'atmosphere.visible': this.eventManager.emit('changeVisibleAtmosphere', payload); break;
        case 'landscapes.visible': this.eventManager.emit('changeVisibleLandscapes', payload); break;
        case 'stars.visible': this.eventManager.emit('changeVisibleStars', payload); break;
        case 'dss.visible': this.eventManager.emit('changeVisibleDSS', payload); break;
        case 'dsos.visible': this.eventManager.emit('changeVisibleDSO', payload); break;
        case 'comets.visible': this.eventManager.emit('changeVisibleComets', payload); break;
        case 'milkyway.visible': this.eventManager.emit('changeVisibleMilkyway', payload); break;
        case 'minor_planets.visible': this.eventManager.emit('changeVisibleMinorPlanets', payload); break;
        case 'planets.visible': this.eventManager.emit('changeVisiblePlanets', payload); break;
        case 'satellites.visible': this.eventManager.emit('changeVisibleSatellites', payload); break;
        case 'lines.meridian.visible': this.eventManager.emit('changeVisibleMeridianLine', payload); break;
        case 'lines.ecliptic.visible': this.eventManager.emit('changeVisibleEclipticLine', payload); break;
        case 'lines.azimuthal.visible': this.eventManager.emit('changeVisibleAzimuthalLine', payload); break;
        case 'lines.equatorial_jnow.visible': this.eventManager.emit('changeVisibleEquatorialLine', payload); break;

        case 'fps':
        case 'observer.tt':
        case 'clicks': break;

        default: {
          if (IS_DEV) {
            console.log(path, payload);
          }
          break;
        }
      }

    });
  }

  private swobjToSkyObject(obj: any): SkyObject {
    const jsonData = obj.jsonData;
    const modelData = obj.jsonData.model_data;

    const result: SkyObject = {} as SkyObject;
    result.id = obj.v;
    result.type = jsonData.model;
    result.types = jsonData.types;
    result.name = obj.id;
    result.names = jsonData.names;
    result.magnitude = obj.getInfo('vmag');

    const radec = obj.getInfo('radec');
    const posCIRS = this.engine.c2s(this.engine.convertFrame(this.engine.core.observer, 'ICRF', 'JNOW', radec));
    result.celestialCoordinates = { ra: this.engine.anp(posCIRS[0]), dec: this.engine.anpm(posCIRS[1]) };

    const azalt = this.engine.c2s(this.engine.convertFrame(this.engine.core.observer, 'ICRF', 'OBSERVED', radec));
    result.horizontalCoordinates = { az: this.engine.anp(azalt[0]), alt: this.engine.anpm(azalt[1]) }

    result.morpho = modelData?.morpho;
    result.phase = obj.getInfo('phase');
    result.distance = obj.getInfo('distance');
    result.size = modelData?.dimx ? [modelData.dimx, modelData.dimy || modelData.dimx] : undefined;
    result.spectralType = modelData?.spect_t;
    result.radius = obj.getInfo('radius');
    const planetRadius = planets[this.engine.designationCleanup(result.name).toLowerCase()]?.radius;
    if (planetRadius) {
      result.radius = planetRadius;
    }

    return result;
  }
}

function addDataSource(engine: StellariumOriginal, dataSource: Partial<DataSourceUrlProvider>) {

  if (dataSource['stars-base']) {
    engine.core.stars.addDataSource({ url: dataSource['stars-base'], key: 'base' });
  }
  if (dataSource['stars-minimal']) {
    engine.core.stars.addDataSource({ url: dataSource['stars-minimal'], key: 'minimal' });
  }
  if (dataSource['stars-extended']) {
    engine.core.stars.addDataSource({ url: dataSource['stars-extended'], key: 'extended' });
  }
  if (dataSource['stars-gaia']) {
    engine.core.stars.addDataSource({ url: dataSource['stars-gaia'], key: 'gaia' });
  }

  if (dataSource['dso-base']) {
    engine.core.dsos.addDataSource({ url: dataSource['dso-base'] });
  }
  if (dataSource['dso-extended']) {
    engine.core.dsos.addDataSource({ url: dataSource['dso-extended'] });
  }

  if (dataSource['planet-callisto']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-callisto'], key: 'callisto' });
  }
  if (dataSource['planet-default']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-default'], key: 'default' });
  }
  if (dataSource['planet-europa']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-europa'], key: 'europa' });
  }
  if (dataSource['planet-ganymede']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-ganymede'], key: 'ganymede' });
  }
  if (dataSource['planet-io']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-io'], key: 'io' });
  }
  if (dataSource['planet-jupiter']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-jupiter'], key: 'jupiter' });
  }
  if (dataSource['planet-mars']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-mars'], key: 'mars' });
  }
  if (dataSource['planet-mercury']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-mercury'], key: 'mercury' });
  }
  if (dataSource['planet-moon-normal']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-moon-normal'], key: 'moon-normal' });
  }
  if (dataSource['planet-moon']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-moon'], key: 'moon' });
  }
  if (dataSource['planet-neptune']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-neptune'], key: 'neptune' });
  }
  if (dataSource['planet-saturn']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-saturn'], key: 'saturn' });
  }
  if (dataSource['planet-sun']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-sun'], key: 'sun' });
  }
  if (dataSource['planet-uranus']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-uranus'], key: 'uranus' });
  }
  if (dataSource['planet-venus']) {
    engine.core.planets.addDataSource({ url: dataSource['planet-venus'], key: 'venus' });
  }

  if (dataSource['background-milkyway']) {
    engine.core.milkyway.addDataSource({ url: dataSource['background-milkyway'] });
  }
  if (dataSource['background-dss']) {
    engine.core.dss.addDataSource({ url: dataSource['background-dss'] });
  }
  if (dataSource['etc-minor-planets']) {
    engine.core.minor_planets.addDataSource({ url: dataSource['etc-minor-planets'], key: 'mpc_asteroids' });
  }
  if (dataSource['etc-comets']) {
    engine.core.comets.addDataSource({ url: dataSource['etc-comets'], key: 'mpc_comets' });
  }
  if (dataSource['etc-satellites']) {
    engine.core.satellites.addDataSource({ url: dataSource['etc-satellites'], key: 'jsonl/sat' });
  }

  if (dataSource['background-landscapes-guereins']) {
    engine.core.landscapes.addDataSource({ url: dataSource['background-landscapes-guereins'], key: 'guereins' });
    engine.core.landscapes.visible = true;
  } else {
    engine.core.landscapes.visible = false;
  }

  if (dataSource['skyculture-western']) {
    engine.core.skycultures.addDataSource({ url: dataSource['skyculture-western'], key: 'western' })
  }
}
