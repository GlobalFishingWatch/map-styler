import { FeatureCollection } from 'geojson'
import { GeneratorStyles } from '../types'

export enum Type {
  Background = 'BACKGROUND',
  Basemap = 'BASEMAP',
  CartoPolygons = 'CARTO_POLYGONS',
  GL = 'GL',
  Heatmap = 'HEATMAP',
  Track = 'TRACK',
  VesselEvents = 'VESSEL_EVENTS',
}

export interface Generator {
  type: string
  getStyle: (layer: GeneratorConfig) => GeneratorStyles
}

export interface GlobalGeneratorConfig {
  start?: string
  end?: string
  zoom?: number
  zoomLoadLevel?: number
}

export interface GeneratorConfig extends GlobalGeneratorConfig {
  id: string
  type: Type | string
  visible?: boolean
  opacity?: number
}

/**
 * A solid color background layer
 */
export interface BackgroundGeneratorConfig extends GeneratorConfig {
  type: Type.Background
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
}

/**
 * Placeholder for a generic set of Mapbox GL layers (consisting of one or more sources and one or mor layers)
 */
export interface GlGeneratorConfig extends GeneratorConfig {
  sources?: any
  layers?: any
}

/**
 * Renders outlined polygons for our CARTO tables library, typically context layers. Takes care of instanciating CARTO anonymous maps/layergroupid (hence asynchronous)
 */
export interface CartoPolygonsGeneratorConfig extends GeneratorConfig {
  baseUrl?: string
  selectedFeatures?: any
  color?: string
  fillColor?: any
  strokeColor?: string
  strokeWidth?: number
  radius?: number
}

/**
 * Renders a vessel track that can be filtered by time. Will use `start` and `end` from the global generator config, if set
 */
export interface TrackGeneratorConfig extends GeneratorConfig {
  type: Type.Track
  /**
   * A GeoJSON made of one or more LineStrings. Features should have `coordinateProperties` set in order to filter by time
   */
  data: FeatureCollection
  /**
   * Progresseively simplify geometries when zooming out for improved performance
   */
  simplify?: boolean
  /**
   * Sets the color of the map background in any format supported by Mapbox GL, see https://docs.mapbox.com/mapbox-gl-js/style-spec/types/#color
   */
  color?: string
}

export interface VesselEventsGeneratorConfig extends GeneratorConfig {
  data: RawEvent[]
  currentEventId?: string
}

export interface HeatmapGeneratorConfig extends GeneratorConfig {
  start: string
  end: string
  zoom: number
  delta?: number
  tileset: string
  geomType: string
  singleFrame?: boolean
  fetchStats?: boolean
  serverSideFilter?: string
  updateColorRampOnTimeChange?: boolean
  quantizeOffset?: number
  colorRamp: ColorRamps
  colorRampMult: number
}

export type AnyGeneratorConfig =
  | BackgroundGeneratorConfig
  | GlGeneratorConfig
  | CartoPolygonsGeneratorConfig
  | TrackGeneratorConfig
  | VesselEventsGeneratorConfig
  | HeatmapGeneratorConfig

// ---- Generator specific types
export type RawEvent = {
  id: string
  type: string
  position: {
    lng?: number
    lon?: number
    lat: number
  }
  start: number
  encounter?: {
    authorized: boolean
    authorizationStatus: AuthorizationOptions
  }
}

export type AuthorizationOptions = 'authorized' | 'partially' | 'unmatched'

// ---- Heatmap Generator types
export type ColorRamps = 'fishing' | 'presence' | 'reception'
export type HeatmapColorRamp = {
  [key: string]: ColorRamps
}
export type HeatmapColorRampColors = {
  [key in string]: string[]
}