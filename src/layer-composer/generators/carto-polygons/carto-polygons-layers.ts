/* eslint-disable @typescript-eslint/camelcase */
export default {
  cp_rfmo: {
    source: {
      sql: 'SELECT the_geom, the_geom_webmercator, cartodb_id, id FROM carrier_portal_rfmo_hi_res',
      type: 'vector',
    },
    layers: [
      {
        id: 'cp_rfmo',
        type: 'fill',
        source: 'cp_rfmo',
        'source-layer': 'cp_rfmo',
      },
    ],
  },
  mpant: {
    source: {
      sql: 'select * FROM wdpa_no_take_mpas',
      type: 'vector',
      attribution: 'MPA: Protected Planet WDPA',
    },
    layers: [
      {
        id: 'mpant',
        type: 'fill',
        source: 'mpant',
        'source-layer': 'mpant',
      },
      {
        id: 'mpant-labels',
        type: 'symbol',
        source: 'mpant',
        'source-layer': 'mpant',
        layout: {
          'text-field': '{name}',
          'text-font': ['Roboto Mono Light'],
          'text-size': 10,
        },
      },
    ],
  },
  eez: {
    source: {
      sql:
        "SELECT cartodb_id, the_geom, the_geom_webmercator, geoname as name, 'eez:' || mrgid as region_id, geoname as reporting_name, 'eez:' || mrgid as reporting_id FROM eez",
      type: 'vector',
      attribution: 'EEZs: marineregions.org',
    },
    layers: [
      {
        id: 'eez',
        type: 'fill',
        source: 'eez',
        'source-layer': 'eez',
      },
      {
        id: 'eez-labels',
        type: 'symbol',
        source: 'eez',
        'source-layer': 'eez',
        layout: {
          'text-field': '{name}',
          'text-font': ['Roboto Mono Light'],
          'text-size': 10,
        },
      },
    ],
  },
  bluefin_rfmo: {
    source: {
      sql: 'SELECT the_geom, the_geom_webmercator, cartodb_id FROM bluefin_rfmo',
      type: 'vector',
    },
    layers: [
      {
        id: 'bluefin_rfmo',
        type: 'fill',
        source: 'bluefin_rfmo',
        'source-layer': 'bluefin_rfmo',
      },
    ],
  },
  landmass: {
    source: {
      sql: 'SELECT the_geom, the_geom_webmercator, cartodb_id FROM landmass',
      type: 'vector',
    },
    layers: [
      {
        id: 'landmass',
        type: 'fill',
        source: 'landmass',
        'source-layer': 'landmass',
      },
    ],
  },
}
