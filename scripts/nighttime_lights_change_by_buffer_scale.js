////////////////////////////////////////
// How conditions change across time  //
// within different neighborhoods     //
// of a point of interest.            //
//                                    //
// Jeff Howarth                       //
//                                    //
// last update:                       //
// 07.23.2020                         //
//                                    //
////////////////////////////////////////

// Define style variables
// ======================

var background = '#211F10';

// Compose map
// ===========

// initialize map

var map = ui.Map();

// Import and filter dataset
var lights = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate('1992-01-01', '2014-01-01')
  .select('avg_vis')
;

// Define color ramp
var lightsVis = {min: 0, max: 63, palette:['black', '#ffec82', 'white']};

// add layer
map.addLayer(lights.max(), lightsVis, 'Lights at Night in 2013',1,0.5);

// set base map
map.setOptions('HYBRID');

// Compose gradient legend
// ==========================

// initialize a panel for legend
var legend = ui.Panel({
  style: {
    backgroundColor: background,
    position: 'top-right',
    padding: '8px 15px',
    maxWidth: '50%',
    }
  });

// Create legend title
var legendTitle = ui.Label({
  value: 'Average visibility in 2013',
  style: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: 'Helvetica',
    backgroundColor: background
    }
  });

// Add the title to the panel
legend.add(legendTitle);

// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((lightsVis.max-lightsVis.min)/100.0).add(lightsVis.min);
var legendImage = gradient.visualize(lightsVis);

// create text on top of legend
var panelMax = ui.Panel({
  style: {
    backgroundColor: background
  },
  widgets: [
    ui.Label({
      value: lightsVis['max'],
      style: {
        color: 'white',
        fontFamily: 'Helvetica',
        backgroundColor: background
        }
      })
    ],
    });

// add 'max' label to legend
legend.add(panelMax);

// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'10x200'},
style: {padding: '1px', position: 'bottom-center'}
});

// add the thumbnail to the legend
legend.add(thumbnail);

// create text on top of legend
var panelMin = ui.Panel({
  style: {
    backgroundColor: background
  },
  widgets: [
    ui.Label({
      value: lightsVis['min'],
      style: {
        color: 'white',
        fontFamily: 'Helvetica',
        backgroundColor: background
        }
      })
    ],
    });

// add 'min' label to the legend
legend.add(panelMin);


// Compose panel for map descriptions
// ==================================

// Create panel
var instructionPanel = ui.Panel({
  style: {
    maxWidth: '50%',
    backgroundColor: background,
    position: 'top-left'
  }
});

// Describe base map
var mapInstructions = ui.Label({
  value: "This map shows visibility of lights at night in 2013 on a gradient from 0 (dark) to 63 (very bright).",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '8px',
    backgroundColor: background
  }
});

// add description
instructionPanel.add(mapInstructions);

// Describe zoom
var zoomInstructions = ui.Label({
  value: "You can use the zoom tools on the map (upper left) to zoom in (+) or zoom out (-).",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background,
    whiteSpace: 'normal'
  }
});

// add description
instructionPanel.add(zoomInstructions);

// Describe pan
var panInstructions = ui.Label({
  value: "You can also click-hold-and-drag to pan the map.",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background,
    whiteSpace: 'normal'
  }
});

// add description
instructionPanel.add(panInstructions);

// Create a panel with absolute layout
var splitLegend = ui.Panel({
  layout: ui.Panel.Layout.flow({
    direction: 'horizontal',
    wrap: true
    }),
  style: {
    backgroundColor: background
  }
});

// add elements
splitLegend.add(instructionPanel)
splitLegend.add(legend)

// Compose side panel for marginalia
// ================================

// Initialize side panel
var panelSide = ui.Panel({
  style: {
    width: '30%',
    backgroundColor: background
  }
});

// Compose title
var title = ui.Label({
  value: 'Change in lights at night across neighborhood scales',
  style: {
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: 'yellow',
    padding: '4px',
    backgroundColor: background
  }
});

// Describe figural layers
var figureInstructions = ui.Label({
  value: "If you zoom way in towards the red dot on the map, you'll see three circles. Each circle represents the neighborhood within 1/4 mile (yellow), 1 mile (orange), and 5 miles (red) of the red dot. To start with, we're looking at Watford City, North Dakota, USA.",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background
  }
});

// Explain how chart works
var chartInstructions = ui.Label({
  value: "The chart below shows how values of nighttime lights changed over time in each neighborhood.",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background
  }
});

// Create panel for chart
var chartPanel = ui.Panel({
  style: {
    backgroundColor: background
  }
});

// Compose instructions for exploring map
var useInstructions = ui.Label({
  value: "Click anywhere on the map and the chart will update to show changes in neighborhoods around your new location. You can also use Google's Search Bar at the top to type in the names of places that you'd like to explore.",
  style: {
    fontSize: '18px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background
  }
});

// Compose sources
var sources = ui.Label({
  value: 'Sources: NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
  style: {
    fontSize: '11px',
    fontFamily: 'Helvetica',
    color: 'white',
    padding: '4px',
    backgroundColor: background
  }
});

// Compose credit
var credit = ui.Label({
  value: 'Jeff Howarth, Geography Department, Middlebury College, jhowarth@middlebury.edu',
  style: {
    fontSize: '11px',
    fontFamily: 'Helvetica',
    color: 'white',
    backgroundColor: background
  }
});

// initialize split panel for main layout
var splitPanel = ui.SplitPanel({
  firstPanel: panelSide,
  secondPanel: map,
});

// clear root and add split panel
ui.root.clear();
ui.root.add(splitPanel);


// Add elements to the side panel in order of appearance

panelSide.add(title);
panelSide.add(splitLegend);
panelSide.add(figureInstructions);
panelSide.add(chartInstructions);
panelSide.add(chartPanel);
panelSide.add(useInstructions);
panelSide.add(sources);
panelSide.add(credit);

// Make regions
// ======================
var makeRegions = function(point) {
  var scale1 = 402;
  var scale2 = 1609;
  var scale3 = 8046;
  var regions = ee.FeatureCollection(ee.Feature(point.buffer(scale1)).set('scale',scale1))
    .merge(ee.FeatureCollection(ee.Feature(point.buffer(scale2)).set('scale',scale2)))
    .merge(ee.FeatureCollection(ee.Feature(point.buffer(scale3)).set('scale',scale3)))
    return regions;
}

// Show layers on the map.
// ======================
function showRegionsOnMap(point) {
  var dot = ui.Map.Layer(point, {color: 'red'}, 'Point of Interest');
  var regions = makeRegions(point);
  var region1 = ui.Map.Layer(regions.filter(ee.Filter.eq('scale', 402)), {color: 'yellow'}, '1/4 mi',1,0.5);
  var region2 = ui.Map.Layer(regions.filter(ee.Filter.eq('scale', 1609)), {color: 'orange'}, '1 mi',1,0.5);
  var region3 = ui.Map.Layer(regions.filter(ee.Filter.eq('scale', 8046)), {color: 'red'}, '5 mi',1,0.5);
  map.layers().set(1, region3);
  map.layers().set(2, region2);
  map.layers().set(3, region1);
  map.layers().set(4, dot);
  map.centerObject(point, 7);
}


// Display a chart.
// ======================
function makeChart(point) {
  var regions = makeRegions(point);
  var chart = ui.Chart.image.seriesByRegion(lights, regions, ee.Reducer.median(), 0, 1000);
  chart.setOptions({
    title: 'Lights at Night Over Time',
    titleTextStyle:
      {color: 'yellow',
      fontSize: 16,
      bold: false
      },
    backgroundColor:
      {fill: background,
      },
    series: {
      0: {
        color: 'yellow',
        curveType: 'function',
        labelInLegend: '1/4 mi'
      },
      1: {
        color: 'orange',
        curveType: 'function',
        labelInLegend: '1 mi'
      },
      2: {
        color: 'red',
        curveType: 'function',
        labelInLegend: '5 mi'
      }
      },
    vAxis: {
      title: 'LoN',
      ticks: [0,10,20,30,40,50,60,70],
      textStyle:
        {color: 'white',
        fontSize: 12},
      gridlines: {
        color: 'gray'}
      },
    hAxis: {
      title: 'date',
      format: 'yyyy',
      gridlines: {color: 'gray'},
      textStyle:
        {color: 'white',
        fontSize: 12,
        bold: false}},
      gridlines: {color: 'gray'},
    legend: {
      textStyle: {
        color: 'white',
        fontSize: 12,
        bold: false
      }}
  });
  chartPanel.clear();
  chartPanel.add(chart);
}

// Bind the click handler to the new map.
map.onClick(function(coordinates){
  var point = ee.Geometry.Point([coordinates.lon, coordinates.lat]);
  makeRegions(point);
  makeChart(point);
  showRegionsOnMap(point)
});

makeRegions(point);
showRegionsOnMap(point);
makeChart(point);
