const layers = {
  'north-star': {
    source: {
      tiles: [
        'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      ],
      type: 'raster',
      tileSize: 256,
    },
    layers: [
      {
        id: 'north-star',
        type: 'raster',
        source: 'north-star',
      },
    ],
  },
}

export default layers
