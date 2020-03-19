import { FeatureCollection, Feature, LineString, Position } from 'geojson'
import { Dictionary } from '../../types'

const POS_MAX_Δ = 0.005 // 500m at equator - https://www.usna.edu/Users/oceano/pguth/md_help/html/approx_equivalents.htm
const COORD_PROPS_MAX_ΔS: Dictionary<number> = {
  times: 600000, //10mn
  speeds: 1,
  courses: 20,
}

const POS_ROUND = 4
const COORD_PROPS_ROUND: Dictionary<number> = {
  times: 0,
  speeds: 2,
  courses: 0,
}

const cheapDistance = (coordA: Position, coordB: Position) => {
  const longitudeΔ = coordA[0] - coordB[0]
  const latitudeΔ = coordA[1] - coordB[1]
  return Math.sqrt(longitudeΔ * longitudeΔ + latitudeΔ * latitudeΔ)
}

const round = (value: number, numDecimals: number) => {
  const base = Math.pow(10, numDecimals)
  return Math.round(value * base) / base
}

const roundPos = (pos: Position) => [round(pos[0], POS_ROUND), round(pos[1], POS_ROUND)]

const TS_OFFSET = new Date(2012, 0, 1).getTime()
const compressTimestamp = (ts: number) => {
  return Math.round((ts - TS_OFFSET) / 1000)
}

export const simplifyTrack = (track: FeatureCollection) => {
  const simplifiedTrack: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  track.features.forEach((feature) => {
    const line = feature.geometry as LineString
    const coordProps = feature.properties?.coordinateProperties || {}

    const simplifiedGeometry: LineString = {
      type: 'LineString',
      coordinates: [],
    }
    const simplifiedCoordProps: Dictionary<number[]> = {}
    const coordPropsKeys = Object.keys(coordProps).filter(
      (key) => COORD_PROPS_MAX_ΔS[key] !== undefined
    )
    coordPropsKeys.forEach((key) => (simplifiedCoordProps[key] = []))

    let lastPos: Position
    const lastCoordinateProperties: Dictionary<number> = {}

    const addFrame = (i: number) => {
      const pos = line.coordinates[i]
      simplifiedGeometry.coordinates.push(
        // roundPos(
        pos
        // )
      )
      lastPos = pos
      coordPropsKeys.forEach((key) => {
        const coordProp = coordProps[key][i]
        const coordPropValue = round(coordProp, COORD_PROPS_ROUND[key])
        // if (key === 'times') {
        //   coordPropValue = compressTimestamp(coordPropValue)
        // }

        simplifiedCoordProps[key].push(coordPropValue)
        lastCoordinateProperties[key] = coordProp
      })
    }

    line.coordinates.forEach((pos, i) => {
      if (i === 0) {
        addFrame(i)
        return
      }

      const posΔ: number = cheapDistance(pos, lastPos)
      const isPosInfMaxΔ = posΔ < POS_MAX_Δ

      // check that every coordProp Δ is less than max Δ
      const isCoordPropsInfMaxΔ = coordPropsKeys.every((key) => {
        const Δ = Math.abs(coordProps[key][i] - lastCoordinateProperties[key])
        const maxΔ = COORD_PROPS_MAX_ΔS[key]
        return Δ < maxΔ
      })

      // if every Δ is inferior we can ignore the pt
      if (isPosInfMaxΔ && isCoordPropsInfMaxΔ) {
        return
      }

      // else add it to the track and store it for next Δ calc
      addFrame(i)
    })
    const simplifiedFeature: Feature = {
      type: 'Feature',
      geometry: simplifiedGeometry,
      properties: {
        coordinateProperties: simplifiedCoordProps,
        ...feature.properties,
      },
    }
    simplifiedTrack.features.push(simplifiedFeature)
  })
  return simplifiedTrack
}