import { StellariumOriginal } from "./lib";

export class Geometry {
  #engine: StellariumOriginal;

  #layer: Layer;

  objects: Map<string, any>;

  constructor(engine: StellariumOriginal) {
    this.#engine = engine;
    this.#layer = (engine as any).createLayer({ id: 'geometry', z: 7, visible: true });
    this.objects = new Map();
  }

  clear() {
    const objects = this.objects.values()
    for (const obj of objects) {
      this.#layer.remove(obj);
    }
    this.objects.clear();
  }

  remove(id: string) {
    const obj = this.objects.get(id);
    if (obj) {
      this.#layer.remove(obj);
      this.objects.delete(id);
    }
  }

  addText({
    id, coordinates, text,
    anchor = 'center',
    offset = [0, 0],
    rotate = 0,
    size = 20,
    color = '#ffffff',
    opacity = 1,
  }: {
    id: string,
    coordinates: GeoPoint['coordinates'],
    text: GeoProperties['title'],
    anchor?: GeoProperties['text-anchor'];
    offset?: GeoProperties['text-offset'];
    rotate?: GeoProperties['text-rotate'];
    size?: GeoProperties['text-size'];
    color?: GeoProperties['stroke'];
    opacity?: GeoProperties['stroke-opacity'];
  }) {
    const { err, payload } = this.#validateText(text);
    if (err) return { err, payload };

    return this.#addFeature({
      type: 'Feature',
      geometry: {
        id,
        type: 'Point',
        coordinates,
      },
      properties: {
        title: text,
        'text-anchor': anchor,
        'text-offset': offset,
        'text-rotate': rotate,
        'text-size': size,
        "stroke-opacity": opacity,
        stroke: color,
      },
    });
  }

  addCircle({
    id, center, radius,
    fillColor = '#ffffff',
    opacity = 0.7,
  }: {
    id: string,
    center: Coordinates,
    radius: number,
    fillColor?: string,
    opacity?: number,
  }) {
    return this.#addFeature({
      type: 'Feature',
      geometry: {
        id,
        type: 'Circle',
        center,
        radius,
      },
      properties: {
        "stroke-opacity": 0,
        "fill-opacity": opacity,
        fill: fillColor,
      },
    });
  }

  addPolygon({
    id,
    coordinates,
    fillColor = '#ffffff',
    opacity = 0.7,
  }: {
    id: string,
    coordinates: Coordinates[],
    fillColor?: string,
    opacity?: number,
  }) {
    return this.#addFeature({
      type: 'Feature',
      geometry: {
        id,
        type: 'Polygon',
        coordinates: [coordinates],
      },
      properties: {
        "stroke-opacity": 0,
        "fill-opacity": opacity,
        fill: fillColor,
      },
    });
  }

  addLines({
    id, coordinates,
    strokeColor = '#ffffff',
    opacity = 0.7,
  }: {
    id: string,
    coordinates: Coordinates[],
    strokeColor?: string,
    opacity?: number,
  }) {
    return this.#addFeature({
      type: 'Feature',
      properties: {
        "stroke-opacity": opacity,
        stroke: strokeColor,
      },
      geometry: {
        id,
        type: 'LineString',
        coordinates: coordinates,
      }
    });
  }

  #addFeature(feature: GeoFeature) {
    const id = feature.geometry.id;
    if (this.objects.get(id)) {
      return {
        err: 'duplicate-id',
        payload: id,
      } as const;
    }

    const geojson: Geojson = {
      data: {
        type: 'FeatureCollection',
        features: [feature],
      }
    };
    const obj = (this.#engine as any).createObj('geojson', geojson);
    this.#layer.add(obj);
    this.objects.set(id, obj);

    return {};
  }

  #validateText(text: string = '') {
    for (let i = 0; i < text.length; i += 1) {
      if (text.charCodeAt(i) > 127) {
        return {
          err: 'invalid-text',
          payload: text[i],
        } as const;
      }
    }
    return {};
  }
}

interface Geojson {
  data: {
    type: 'FeatureCollection';
    features: GeoFeature[];
  }
}

type GeoObject = GeoPoint | GeoCircle | GeoPolygon | GeoLineString;

interface GeoPoint {
  id: string;
  type: 'Point';
  coordinates: Coordinates;
}
interface GeoCircle {
  id: string;
  type: 'Circle';
  center: Coordinates;
  radius: number;
}
interface GeoPolygon {
  id: string;
  type: 'Polygon';
  coordinates: [Coordinates[]];
}
interface GeoLineString {
  id: string;
  type: 'LineString';
  coordinates: Coordinates[];
}
type Coordinates = [number, number];

interface GeoProperties {
  stroke: string;
  'stroke-width': number;
  'stroke-opacity': number;
  fill: string;
  'fill-opacity': number;

  title: string;
  'text-anchor': 'left' | 'center' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  'text-offset': Coordinates;
  'text-rotate': number;
  'text-size': number;
}

interface GeoFeature {
  type: 'Feature';
  geometry: GeoObject;
  properties: Partial<GeoProperties>;
}

declare class Layer {
  add(geojson: Geojson): void;
  remove(geojson: Geojson): void;
}