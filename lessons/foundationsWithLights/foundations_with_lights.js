/*
------------------------------------------

  Foundations with nighttime lights
  Jeff Howarth
  jhowarth@middlebury.edu

  November 2020

  Known issues:

  1. toFind() digits argumenent error
  2. Chart conditions over time not linked to reducer option.
  3. add RGB method

..
..........................................
*/

// The path name (string) must point to moduleOne.js.
// This module contains a few recurring ui methods: legends, panels, checkboxes.

var tools = require('users/jhowarth/drafts:methods/moduleOne.js');

// Define style variables
// ======================

var background = 'white';
var font = 'Lato, sans-serif';
var chartBackground = '#000626';
var chartData = '#ffffe0';
var chartAnnotation = '#f4bf87';
var chartRefLines = '#94574e';
var titleColor = 'black';
var instructionColor = '#00062A';
var dataColor = 'red';
var palette = ['black', '#000b4a', '#5a2c49', '#94574e', '#c9875e', '#f4bf87', '#ffffe0', 'white'];
var thresholdPalette = [chartBackground, chartData];
var snapshotPalette = ['black', 'cyan', 'red', 'yellow'];

// Define the config parameters for the app.
// ========================================

var config = {
  data: "NOAA/DMSP-OLS/NIGHTTIME_LIGHTS",
  band: 'avg_vis',
  filterStart: '1992-01-01',
  filterEnd: '2014-01-01',
  filterStart1: '1992-01-01',
  filterEnd1: '1994-01-01',
  filterStart2: '2012-01-01',
  filterEnd2: '2014-01-01',
  label: 'Lights at Night',
  reduce: ee.Reducer.first(),
  reduceRegion: ee.Reducer.first(),
  zoom: 6,
  vis: {min: 0, max: 100, palette: palette},
  point: ee.Geometry.Point([-103.283097, 47.799033]),
  buffer1: 1000,
  buffer2: 1000,
  opacityRegion1: 0,
  opacityRegion2: 0,
  opacityLights: 1,
  opacityPoint: 0,
  threshold: 50,
  opacityThreshold: 1
};

// Initialize panels and map
// ========================

var sidePanelStyle = {
  width: '33%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '6px 6px',
  margin: '0px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var sectionPanelStyle = {
  width: '95%',
  backgroundColor: background,
  direction: 'vertical',
  shown: false,
  padding: '2px 0px',
  margin: '2px 18px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var gridPanelStyle = {
  width: '95%',
  backgroundColor: background,
  direction: 'horizontal',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var imagePanelStyle = {
  width: '60%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var sliderPanelStyle = {
  width: '65%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var labelPanelStyle = {
  width: '35%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var entryPanelStyle = {
  width: '25%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var notesPanelStyle = {
  width: '25%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

var elementPanelStyle = {
  width: '95%',
  backgroundColor: background,
  direction: 'vertical',
  shown: true,
  padding: '2px 0px',
  margin: '2px 0px',
  textAlign: 'left',
  whiteSpace: 'pre'
};

// side panel
// ----------
var sidePanel = tools.makePanel(sidePanelStyle);

var legendPanel = tools.makePanel(gridPanelStyle);
var legendLabelPanel = tools.makePanel(labelPanelStyle);
var legendImagePanel = tools.makePanel(imagePanelStyle);
// ----------
// Chapter 1
// ----------

// Explore lights at night
// -----------------------
var explorePanel = tools.makePanel(sectionPanelStyle);
var explorePlacesPanel = tools.makePanel(gridPanelStyle);
var exploreZoomPanel = tools.makePanel(gridPanelStyle);
var exploreOpacityPanel = tools.makePanel(gridPanelStyle);

var explorePlacesLabelPanel = tools.makePanel(labelPanelStyle);
var explorePlacesImagePanel = tools.makePanel(imagePanelStyle);

var exploreZoomLabelPanel = tools.makePanel(labelPanelStyle);
var exploreZoomImagePanel = tools.makePanel(sliderPanelStyle);

var exploreOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var exploreOpacityImagePanel = tools.makePanel(sliderPanelStyle);

// Filter data panels
// -------------------------
var filterPanel = tools.makePanel(sectionPanelStyle);
var filterStartPanel = tools.makePanel(gridPanelStyle);
var filterEndPanel = tools.makePanel(gridPanelStyle);
var filterBandPanel = tools.makePanel(gridPanelStyle);

var filterStartLabelPanel = tools.makePanel(labelPanelStyle);
var filterEndLabelPanel = tools.makePanel(labelPanelStyle);
var filterBandLabelPanel = tools.makePanel(labelPanelStyle);
var filterStartInstructionsPanel = tools.makePanel(notesPanelStyle);
var filterEndInstructionsPanel = tools.makePanel(notesPanelStyle);

var filterStartImagePanel = tools.makePanel(imagePanelStyle);
var filterEndImagePanel = tools.makePanel(imagePanelStyle);
var filterBandImagePanel = tools.makePanel(imagePanelStyle);

// Inspect conditions at location panels
// -------------------------------------
var inspectLocationPanel = tools.makePanel(sectionPanelStyle);
var inspectOpacityPanel = tools.makePanel(gridPanelStyle);
var inspectCenterPanel = tools.makePanel(gridPanelStyle);
var inspectReducerPanel = tools.makePanel(gridPanelStyle);
var inspectValuePanel = tools.makePanel(elementPanelStyle);

var inspectOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var inspectOpacityImagePanel = tools.makePanel(sliderPanelStyle);
var inspectCenterLabelPanel = tools.makePanel(labelPanelStyle);
var inspectCenterImagePanel = tools.makePanel(imagePanelStyle);
var inspectReducerLabelPanel = tools.makePanel(labelPanelStyle);
var inspectReducerImagePanel = tools.makePanel(imagePanelStyle);

var inspectChartPanel = tools.makePanel(elementPanelStyle);
var inspectLegendPanel = tools.makePanel(elementPanelStyle);

// ----------
// Chapter 2
// ----------

// Chart conditions in a region panels
// -----------------------------------
var conditionRegionPanel = tools.makePanel(sectionPanelStyle);
var conditionOpacityPanel = tools.makePanel(gridPanelStyle);
var conditionBufferPanel = tools.makePanel(gridPanelStyle);
var conditionHistogramPanel = tools.makePanel(elementPanelStyle);

var conditionOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var conditionOpacityImagePanel = tools.makePanel(sliderPanelStyle);

var conditionBufferLabelPanel = tools.makePanel(labelPanelStyle);
var conditionBufferImagePanel = tools.makePanel(sliderPanelStyle);

// Reduce region
// -------------

var reduceRegionPanel = tools.makePanel(sectionPanelStyle);
var reduceConditionsRegionPanel = tools.makePanel(gridPanelStyle);
var reduceConditionsRegionChartPanel = tools.makePanel(elementPanelStyle);

var reduceConditionsRegionLabelPanel = tools.makePanel(labelPanelStyle);
var reduceConditionsRegionImagePanel = tools.makePanel(imagePanelStyle);

// Chart change panels
// -------------------

var conditionTimePanel = tools.makePanel(sectionPanelStyle);
var conditionTimeChartPanel = tools.makePanel(elementPanelStyle);
var conditionTimeOpacityPanel = tools.makePanel(gridPanelStyle);
var conditionTimeBufferPanel = tools.makePanel(gridPanelStyle);

var conditionTimeOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var conditionTimeOpacityImagePanel = tools.makePanel(sliderPanelStyle);

var conditionTimeBufferLabelPanel = tools.makePanel(labelPanelStyle);
var conditionTimeBufferImagePanel = tools.makePanel(sliderPanelStyle);

// ----------
// Chapter 3
// ----------

// Threshold panels
// --------------------------

var thresholdPanel = tools.makePanel(sectionPanelStyle);

var classifyValuePanel = tools.makePanel(gridPanelStyle);
var classifyGradientLegendPanel = tools.makePanel(gridPanelStyle);
var classifyUpdatePanel = tools.makePanel(gridPanelStyle);
var classifyOpacityPanel = tools.makePanel(gridPanelStyle);
var classifyThresholdLegendPanel = tools.makePanel(elementPanelStyle);

var classifyGradientLegendLabelPanel = tools.makePanel(labelPanelStyle);
var classifyGradientLegendImagePanel = tools.makePanel(imagePanelStyle);

var classifyValueLabelPanel = tools.makePanel(labelPanelStyle);
var classifyValueImagePanel = tools.makePanel(sliderPanelStyle);

var classifyLegendLabelPanel = tools.makePanel(labelPanelStyle);
var classifylegendImagePanel = tools.makePanel(imagePanelStyle);

var classifyUpdateLabelPanel = tools.makePanel(labelPanelStyle);
var classifyUpdateImagePanel = tools.makePanel(imagePanelStyle);

var classifyOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var classifyOpacityImagePanel = tools.makePanel(sliderPanelStyle);

// Compare snapshots panels
// ------------------------

var compareSnapPanel = tools.makePanel(sectionPanelStyle);
var startDateOnePanel = tools.makePanel(gridPanelStyle);
var endDateOnePanel = tools.makePanel(gridPanelStyle);
var startDateTwoPanel = tools.makePanel(gridPanelStyle);
var endDateTwoPanel = tools.makePanel(gridPanelStyle);
var snapshotUpdatePanel = tools.makePanel(gridPanelStyle);
var snapshotUpdateLabelPanel = tools.makePanel(labelPanelStyle);
var snapshotOpacityPanel = tools.makePanel(gridPanelStyle);
var snapshotOpacityLabelPanel = tools.makePanel(labelPanelStyle);
var snapshotOpacityImagePanel = tools.makePanel(sliderPanelStyle);

// ==============
// Initialize map
// ==============

var map = ui.Map();
map.setOptions('HYBRID');
map.centerObject(config.point, config.zoom);
map.setControlVisibility({all: false});

// ======================
// Initialize root layout
// ======================

ui.root.clear();
ui.root.add(sidePanel);
ui.root.add(map);

// ================
// make check boxes
// ================

// label style
// -----------

var checkLabelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'black',
  padding: '4px 4px',
  margin: '4px 4px'
};

// check label dictionary
// ----------------------

var checkLabels = {
  exploreData: "Explore data layer",
  filterData: "Filter data",
  inspectLocation: "Inspect conditions at a location",
  conditionLocation: "Chart conditions in a region",
  reduceRegionLabel: "Reduce conditions in a region",
  conditionTime: "Chart conditions over time",
  thresholdLabel: "Classify conditions",
  compareSnapLabel: "Compare snapshots",
};


// Explore lights section
// -----------------------

var exploreCheck = tools.makeCheckBox(checkLabels.exploreData, checkLabelStyle);

exploreCheck.onChange(function(checked) {
  explorePanel.style().set('shown', checked);
});

// Filter and reduce section
// -------------------------

var filterCheck = tools.makeCheckBox(checkLabels.filterData, checkLabelStyle);

filterCheck.onChange(function(checked) {
  filterPanel.style().set('shown', checked);
});

// Inspect conditions section
// --------------------------

var inspectLocationCheck = tools.makeCheckBox(checkLabels.inspectLocation, checkLabelStyle);

inspectLocationCheck.onChange(function(checked) {
  inspectLocationPanel.style().set('shown', checked);
});

// Chart region section
// --------------------

var conditionLocationCheck = tools.makeCheckBox(checkLabels.conditionLocation, checkLabelStyle);

conditionLocationCheck.onChange(function(checked) {
  conditionRegionPanel.style().set('shown', checked);
});

// Reduce region section
// --------------------

var reduceRegionCheck = tools.makeCheckBox(checkLabels.reduceRegionLabel, checkLabelStyle);

reduceRegionCheck.onChange(function(checked) {
  reduceRegionPanel.style().set('shown', checked);
});

// Classify conditions section
// ----------------------------

var thresholdCheck = tools.makeCheckBox(checkLabels.thresholdLabel, checkLabelStyle);

thresholdCheck.onChange(function(checked) {
  thresholdPanel.style().set('shown', checked);
});

// Chart conditions over time section
// ----------------------------------

var conditionTimeCheck = tools.makeCheckBox(checkLabels.conditionTime, checkLabelStyle);

conditionTimeCheck.onChange(function(checked) {
  conditionTimePanel.style().set('shown', checked);
});

// Compare snapshot checkbox
// -------------------------

var compareSnapCheck = tools.makeCheckBox(checkLabels.compareSnapLabel, checkLabelStyle);

compareSnapCheck.onChange(function(checked) {
  compareSnapPanel.style().set('shown', checked);
});

// ===================
// make select widgets
// ===================

// select box style options
// ------------------------

var selectStyle = {
  height: '80%',
  width: '60%',
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: font,
  textAlign: 'center',
  whiteSpace: 'pre',
  shown: true
};

// band variables
// --------------

var bandDict = ee.Dictionary({
  'avg_vis': 'Average visibility',
  'stable_lights': 'Stable lights'
});

// reducer variables
// -----------------

var reduceDict = ee.Dictionary({
  median: ee.Reducer.median(),
  min: ee.Reducer.min(),
  max: ee.Reducer.max(),
  mean: ee.Reducer.mean(),
  first: ee.Reducer.first()
});

// places

var placesDict = ee.Dictionary({
  'Place 1': [-103.2722709910862, 47.80213039382298],
  'Place 2': [31.25846436022713,  30.0595016681364],
  'Place 3': [-61.94477463458123, -10.879824758615536],
  'Place 4': [77.208985067824, 28.554854639015],
  'Place 5': [-66.06047247529416, 18.389261775928087],
  'Place 6': [126.98954999999998, 37.56521430666223],
  'Place 7': [7.033545925902116, 4.824171509419809],
  'Place 8': [139.74086771139116, 35.66838311802032],
  'Place 9': [-157.7990730540274, 21.328052034332284],
  'Suzhou, China': [120.64430239999999, 31.328549582421694]
});


// ui image reduce region variables

// select actions
// --------------

var changePlace = function(key) {
  config.point = ee.Geometry.Point(placesDict.get(key));
  config.zoom = 6;
  map.centerObject(config.point, config.zoom);
  render();
};

var changeBand = function(key) {
  config.band = key;
  render();
};

var changeReduce = function(key) {
  config.reduce = reduceDict.get(key);
  render();
};

var changeRegionReduce = function(key) {
  config.reduceRegion = reduceDict.get(key);
  reducerValueRegion();
};

var makeSelect = function(dictionary, fun) {
  var selectDict = {
  items: dictionary.keys().getInfo(),
  style: selectStyle,
  onChange: fun
  };
  return ui.Select(selectDict);
};

// time window
// -----------

var makeTimeWindow = function(date, fun) {
  var timeDict =  {
    placeholder: date,
    onChange: fun
    };
  return ui.Textbox(timeDict);
};

// full dataset calls
// ------------------

var changeStart = function(text) {
  config.filterStart = text;
  render();
};

var changeEnd = function(text) {
  config.filterEnd = text;
  render();
};

// Snapshot time 1 calls
// ---------------------

var changeStart1 = function(text) {
  config.filterStart1 = text;
};

var changeEnd1 = function(text) {
  config.filterEnd1 = text;
};

// Snapshot time 2 calls
// ---------------------

var changeStart2 = function(text) {
  config.filterStart2 = text;
};

var changeEnd2 = function(text) {
  config.filterEnd2 = text;
};

// ========
// draw map
// ========

var updateImage = function() {
  return ee.ImageCollection(config.data)
    .select(config.band)
    .filterDate(config.filterStart, config.filterEnd)
    .reduce(config.reduce)
    .divide(63).multiply(100);
};

var drawMap = function() {
  map.layers().set(0, ui.Map.Layer(updateImage(), config.vis, config.label, true, config.opacityLights));
};

// Make regions
// ------------

var makeRegion = function(buffer) {
  return config.point.buffer(buffer);
};

// Show point on the map.
// ----------------------

function showPointOnMap() {
  var dotLayer = ui.Map.Layer(config.point, {color: 'red'}, 'Point', true, config.opacityPoint);
  map.layers().set(1, dotLayer);
}

// Show buffered regions on Map
// ----------------------------

function showRegionOneOnMap() {
  // var region = makeRegion();
  var bufferLayer =  ui.Map.Layer(makeRegion(config.buffer1), {color: 'yellow'}, 'Region 1', true, config.opacityRegion1);
  map.layers().set(2, bufferLayer);
}

function showRegionTwoOnMap() {
  // var region = makeRegion();
  var bufferLayer2 =  ui.Map.Layer(makeRegion(config.buffer2), {color: 'red'}, 'Region 2', true, config.opacityRegion2);
  map.layers().set(3, bufferLayer2);
  }

// bind functions to map click
// ---------------------------

map.onClick(function(coordinates){
  config.point = ee.Geometry.Point([coordinates.lon, coordinates.lat]);
  showPointOnMap();
  showRegionOneOnMap();
  showRegionTwoOnMap();
  conditionAtPoint();
  reducerValueRegion();
  makeChart();
  makeChangeChart();
});

// Show threshold image
// --------------------

function showThresholdOnMap() {
  var thresholdLayer = ui.Map.Layer(thresholdImage(config.threshold), {min: 0, max:1, palette: thresholdPalette}, 'Threshold layer', true, config.opacityThreshold);
  map.layers().set(4, thresholdLayer);
}

function showSnapCompOnMap() {
  var snapCompLayer = ui.Map.Layer(compareSnapshots(), {min: 0, max:3, palette: ['black', 'cyan', 'red', 'yellow']}, 'Snapshot Comparison', true, 1);
  map.layers().set(4, snapCompLayer);
}

// =============
// classify data
// =============

// Section 5 Classify conditions
// -----------------------------

var thresholdImage = function(value) {
  return updateImage().gt(value);
};

// Section 6 Compare shanpshots
// ----------------------------

function makeSnapshotOne() {
  return ee.ImageCollection(config.data)
    .filterDate(config.filterStart1, config.filterEnd1)
    .select(config.band)
    .reduce(config.reduce)
    .divide(63).multiply(100);
}

function makeSnapshotTwo() {
  return ee.ImageCollection(config.data)
    .filterDate(config.filterStart2, config.filterEnd2)
    .select(config.band)
    .reduce(config.reduce)
    .divide(63).multiply(100);
}

var compareSnapshots = function() {
  var time1 = makeSnapshotOne().gt(config.threshold);
  var time2 = makeSnapshotTwo().gt(config.threshold).multiply(10);
  var compareSnap = time1.add(time2);
  var oldValues = [0,1,10,11];
  var newValues = [0,1,2,3];
  return compareSnap.remap(oldValues, newValues);
};

// =======
// buttons
// =======

var buttonStyle = {
  height: '80%',
  width: '60%',
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: font,
  textAlign: 'center',
  whiteSpace: 'pre',
  shown: true
};

var thresholdButton = ui.Button({
  label: 'Click to make image',
  style: buttonStyle,
  onClick: function() {
    thresholdImage(config.threshold);
    showThresholdOnMap();
  }
});

var snapshotButton = ui.Button({
  label: 'Click to make image',
  style: buttonStyle,
  onClick: function() {
    compareSnapshots();
    showSnapCompOnMap();
  }
});

var centerPointButton = ui.Button({
  label: 'Click to center on point',
  style: buttonStyle,
  onClick: function() {
    map.centerObject(config.point, config.zoom);
  }
});

// =======
// sliders
// =======

var sliderStyle = {
  width: '100%',
  fontSize: 10,
  fontWeight: 'bold',
  fontFamily: font
};

var thresholdSliderStyle = {
  width: '100%',
  fontSize: 10,
  fontWeight: 'bold',
  fontFamily: font
};

// adjust buffer size
// ------------------

var bufferSliderOptions = {
  min: 1000,
  max: 75000,
  value: 1000,
  step: 1000,
  style: thresholdSliderStyle
  };

var bufferSlider = ui.Slider(bufferSliderOptions);
var bufferSlider2 = ui.Slider(bufferSliderOptions);

bufferSlider.onChange(function(value) {
  config.buffer1 = value;
  showRegionOneOnMap();
  reducerValueRegion();
  makeChart();
  makeChangeChart();
});

bufferSlider2.onChange(function(value) {
  config.buffer2 = value;
  showRegionTwoOnMap();
  makeChangeChart();
});

// adjust zoom level
// -----------------

var zoomSliderOptions = {
  min: 1,
  max: 20,
  value: 4,
  step: 1,
  style: sliderStyle
  };

var zoomSlider = ui.Slider(zoomSliderOptions);

zoomSlider.onChange(function(value) {
  config.zoom = value;
  map.setZoom(config.zoom);
});

// adjust opacity
// --------------

var makeOpacitySliderOptions = function(value) {
  return {
  min: 0,
  max: 1,
  value: value,
  step: 0.1,
  style: sliderStyle
  };
};

// var lightsOpacitySlider = ui.Slider(opacitySliderOptions)
//   .setValue(1, true);

var lightsOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityLights));
var regionOneOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityRegion1));
var regionTwoOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityRegion2));
var pointOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityPoint));
var thresholdOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityThreshold));
var snapshotOpacitySlider = ui.Slider(makeOpacitySliderOptions(config.opacityThreshold));

lightsOpacitySlider.onChange(function(value) {
  config.opacityLights = value;
  map.layers().get(0).setOpacity(config.opacityLights);
});

pointOpacitySlider.onChange(function(value) {
  config.opacityPoint = value;
  map.layers().get(1).setOpacity(config.opacityPoint);
});

regionOneOpacitySlider.onChange(function(value) {
  config.opacityRegion1 = value;
  map.layers().get(2).setOpacity(config.opacityRegion1);
});

regionTwoOpacitySlider.onChange(function(value) {
  config.opacityRegion2 = value;
  map.layers().get(3).setOpacity(config.opacityRegion2);
});

thresholdOpacitySlider.onChange(function(value) {
  config.opacityThreshold = value;
  map.layers().get(4).setOpacity(config.opacityThreshold);
});

snapshotOpacitySlider.onChange(function(value) {
  config.opacityThreshold = value;
  map.layers().get(4).setOpacity(config.opacityThreshold);
});

// threshold sliders
// ------------------

var thresholdSliderOptions = {
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  style: thresholdSliderStyle
};

var thresholdSlider = ui.Slider(thresholdSliderOptions);

thresholdSlider.onChange(function(value) {
  config.threshold = value;
});

// Make regions feature collection
// ===============================

var makeRegions = function(point) {
  return ee.FeatureCollection(ee.Feature(config.point.buffer(config.buffer1)).set('scale',config.buffer1))
    .merge(ee.FeatureCollection(ee.Feature(config.point.buffer(config.buffer2)).set('scale',config.buffer2)));
};

print(makeRegions(config.point));

// Make charts
// ==============

// inspect conditions at point
// ---------------------------

var conditionAtPoint = function() {
  var reduceOptions = {
    image: updateImage(),
    regions: config.point,
    reducer: ee.Reducer.mean(),
    scale:500
    };
  var chartStyle = {
      margin: '8',
      chartArea: {
        width: '90%',
        height: '25%'
      },
      title: 'Data value at point',
      titleTextStyle:
        {color: chartData,
        fontSize: 14,
        bold: true,
        fontFamily: font
        },
      bar: {
        groupWidth: "20%"
      },
      backgroundColor:
        {fill: chartBackground,
        },
      series: {
        0: {
        color: chartData,}
        },
      vAxis: {
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartBackground,
          fontName: font,
          fontSize: 12
          },
        textPosition: 'out'
        },
      hAxis: {
        title: 'Data value',
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartAnnotation,
          fontSize: 12,
          bold: false,
          fontFamily: font
          },
        minValue: 0,
        maxValue: 100
      },
      legend: {
        position: 'none',
        textStyle: {
          color: 'white',
          fontSize: 12,
          bold: false,
          fontFamily: font
        }
      }
    };
  var chart = ui.Chart.image.byRegion(reduceOptions)
    .setChartType("BarChart")
    .setOptions(chartStyle);
  inspectChartPanel.clear();
  inspectChartPanel.add(chart);
};

// chart conditions in a region
// ----------------------------

function makeChart() {
  var region = makeRegion(config.buffer1);
  var histArgs = {
      image: updateImage(),
      region: region,
      scale: 950,
      minBucketWidth: 1,
      // maxRaw: 5000
    };
  var chartStyle = {
      chartArea: {
        width: '80%'
      },
      title: 'Frequency and range of values',
      titleTextStyle:
        {color: chartData,
        fontSize: 14,
        bold: true,
        fontFamily: font
        },
      backgroundColor:
        {fill: chartBackground,
        },
      series: {
        0: {
        color: chartData,}
        },
      vAxis: {
        title: 'Count of pixels',
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartAnnotation,
          fontName: font,
          fontSize: 12
          },
        textPosition: 'out'
        },
      hAxis: {
        title: 'Data value',
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartAnnotation,
          fontSize: 12,
          bold: false,
          fontFamily: font
          }},
        gridlines: {color: chartRefLines},
      legend: {
        position: 'none',
        textStyle: {
          color: 'white',
          fontSize: 12,
          bold: false,
          fontFamily: font
        }
      }
};
  var chart = ui.Chart.image.histogram(histArgs)
    .setOptions(chartStyle);
  conditionHistogramPanel.clear();
  conditionHistogramPanel.add(chart);
}

// reduce values in a region
// -------------------------

var reducerValueRegion = function() {
  var reduceChartOptions = {
    image: updateImage(),
    regions: makeRegion(config.buffer1),
    reducer: ee.Reducer(config.reduceRegion),
    scale: 1000};
  var chartStyle = {
      margin: '8',
      chartArea: {
        width: '90%',
        height: '25%'
      },
      title: 'Reduced value in region',
      titleTextStyle:
        {color: chartData,
        fontSize: 14,
        bold: true,
        fontFamily: font
        },
      bar: {
        groupWidth: "20%"
      },
      backgroundColor:
        {fill: chartBackground,
        },
      series: {
        0: {
        color: chartData,}
        },
      vAxis: {
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartBackground,
          fontName: font,
          fontSize: 12
          },
        textPosition: 'out'
        },
      hAxis: {
        title: 'Data value',
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12,
          italic: true
        },
        gridlines: {color: chartRefLines},
        textStyle:
          {color: chartAnnotation,
          fontSize: 12,
          bold: false,
          fontFamily: font
          },
        minValue: 0,
        maxValue: 100
      },
      legend: {
        position: 'none',
        textStyle: {
          color: 'white',
          fontSize: 12,
          bold: false,
          fontFamily: font
        }
      }
    };
  var reducedChart = ui.Chart.image.byRegion(reduceChartOptions);
  reducedChart.setChartType("BarChart");
  reducedChart.setOptions(chartStyle);
  reduceConditionsRegionChartPanel.clear();
  reduceConditionsRegionChartPanel.add(reducedChart);
};

// Chart conditions over time
// --------------------------

function makeChangeChart() {
  var regions = makeRegions(config.point);
  var chartOptions = {
    imageCollection: ee.ImageCollection(config.data).filterDate(config.filterStart, config.filterEnd),
    band: config.band,
    regions: regions,
    reducer: ee.Reducer.median(),
    scale: 1000
    };
  var chartStyle = {
      chartArea: {
        width: '80%'
      },
      title: 'Lights at night over time',
      titleTextStyle:
        {color: chartData,
        fontSize: 14,
        bold: true,
        fontFamily: font
        },
      backgroundColor:
        {fill: chartBackground,
        },
      series: {
        0: {
        color: 'yellow',
        curveType: 'function',
        labelInLegend: (config.buffer1 / 1000).toString() + " km"
      },
      1: {
        color: 'red',
        curveType: 'function',
        labelInLegend: (config.buffer2 / 1000).toString() + " km"
      },
      vAxis: {
        title: 'Value',
        ticks: [0,10,20,30,40,50,60,70],
        gridlines: {
          color: chartRefLines
          },
        textStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12
          },
          textPosition: 'out'
        },
      },
      hAxis: {
        title: 'Date',
        format: 'yyyy',
        titleTextStyle: {
          color: chartAnnotation,
          fontName: font,
          fontSize: 12
          },
        gridlines: {
          color: chartRefLines
          },
        textStyle:
          {color: chartAnnotation,
          fontSize: 12,
          bold: false,
          fontFamily: font
          }
        },
      legend: {
        alignment: 'start',
        position: 'top',
        textStyle: {
          color: chartAnnotation,
          fontSize: 12,
          bold: false,
          fontFamily: font
          }
        }
    };
  var chart = ui.Chart.image.seriesByRegion(chartOptions);
  chart.setOptions(chartStyle);
  conditionTimeChartPanel.clear();
  conditionTimeChartPanel.add(chart);
}

// ================
// Construct layout
// ================

// label style variables
// ---------------------

var titleLabelStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#94574e',
  padding: '4px 4px',
  margin: '4px 4px',
  whiteSpace: 'pre'
};

var stepLabelStyle = {
  fontSize: '16px',
  fontWeight: 'normal',
  color: 'black',
  padding: '4px 4px',
  margin: '4px 4px',
  whiteSpace: 'pre'
};

var instructionLabelStyle = {
  fontSize: '14px',
  fontWeight: 'normal',
  color: instructionColor,
  padding: '4px 4px',
  margin: '4px 4px',
  whiteSpace: 'pre'
};

var legendLabelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: 'black',
  padding: '4px 4px',
  margin: '4px 4px',
  whiteSpace: 'pre'
};

var notesLabelStyle = {
  fontSize: '10px',
  fontWeight: 'normal',
  color: 'black',
  padding: '4px 4px',
  margin: '4px 4px',
  whiteSpace: 'pre'
};


var instructionSize = '14px';

// label dictionary
// ---------------

var sideLabels = {
  title: "Lights at night",
  legendTitle: "Brightness value\n(percent of maximum)"
};

// side panel layout
// -----------------

sidePanel.add(tools.makeLabel(sideLabels.title, titleLabelStyle));
sidePanel.add(legendPanel);

sidePanel.add(exploreCheck);
sidePanel.add(explorePanel);
sidePanel.add(filterCheck);
sidePanel.add(filterPanel);
sidePanel.add(inspectLocationCheck);
sidePanel.add(inspectLocationPanel);

sidePanel.add(conditionLocationCheck);
sidePanel.add(conditionRegionPanel);
sidePanel.add(reduceRegionCheck);
sidePanel.add(reduceRegionPanel);
sidePanel.add(conditionTimeCheck);
sidePanel.add(conditionTimePanel);

sidePanel.add(thresholdCheck);
sidePanel.add(thresholdPanel);
sidePanel.add(compareSnapCheck);
sidePanel.add(compareSnapPanel);

legendPanel.add(legendLabelPanel);
legendPanel.add(legendImagePanel);

legendLabelPanel.add(tools.makeLabel(sideLabels.legendTitle, legendLabelStyle));
legendImagePanel.add(tools.makeGradientLegend(config.vis));


// explore panel
// -------------

var exploreLabels = {
  exploreLights: "Map elements",
  zoomLevel: "Map zoom level",
  opacityLayer: "Layer opacity",
  places: "Choose a place"
};

explorePanel.add(explorePlacesPanel);
explorePlacesPanel.add(explorePlacesLabelPanel);
explorePlacesPanel.add(makeSelect(placesDict, changePlace));

explorePlacesLabelPanel.add(tools.makeLabel(exploreLabels.places, instructionLabelStyle));

explorePanel.add(exploreOpacityPanel);
explorePanel.add(exploreZoomPanel);

exploreOpacityPanel.add(exploreOpacityLabelPanel);
exploreOpacityPanel.add(exploreOpacityImagePanel);

exploreOpacityLabelPanel.add(tools.makeLabel(exploreLabels.opacityLayer, instructionLabelStyle));
exploreOpacityImagePanel.add(lightsOpacitySlider);

exploreZoomPanel.add(exploreZoomLabelPanel);
exploreZoomPanel.add(exploreZoomImagePanel);

exploreZoomLabelPanel.add(tools.makeLabel(exploreLabels.zoomLevel, instructionLabelStyle));
exploreZoomImagePanel.add(zoomSlider);



// filter layout
// --------------------------------

var filterLabels = {
  filterBandLabel: "Select band",
  filterStartLabel: "Filter start date",
  filterEndLabel: "Filter end date",
  startInstructionsLabel: "On or after 1992-01-01",
  endInstructionsLabel: "On or before 2014-01-01"
};

filterPanel.add(filterStartPanel);
filterPanel.add(filterEndPanel);
filterPanel.add(filterBandPanel);

filterStartPanel.add(filterStartLabelPanel);
filterStartPanel.add(makeTimeWindow(config.filterStart, changeStart));
filterStartPanel.add(filterStartInstructionsPanel);

filterEndPanel.add(filterEndLabelPanel);
filterEndPanel.add(makeTimeWindow(config.filterEnd, changeEnd));
filterEndPanel.add(filterEndInstructionsPanel);

filterBandPanel.add(filterBandLabelPanel);
filterBandPanel.add(makeSelect(bandDict, changeBand));

filterStartLabelPanel.add(tools.makeLabel(filterLabels.filterStartLabel, instructionLabelStyle));
filterStartInstructionsPanel.add(tools.makeLabel(filterLabels.startInstructionsLabel, notesLabelStyle));

filterEndLabelPanel.add(tools.makeLabel(filterLabels.filterEndLabel, instructionLabelStyle));
filterEndInstructionsPanel.add(tools.makeLabel(filterLabels.endInstructionsLabel, notesLabelStyle));

filterBandLabelPanel.add(tools.makeLabel(filterLabels.filterBandLabel, instructionLabelStyle));

// inspect location layout
// -----------------------

var inspectLocationLabels = {
  opacityPoint: "Opacity of point",
  centerPoint: "Center map on point",
  reduceCollection: "Reduce image collection",
};

inspectLocationPanel.add(inspectOpacityPanel);
inspectLocationPanel.add(inspectCenterPanel);
inspectLocationPanel.add(inspectReducerPanel);
inspectLocationPanel.add(inspectValuePanel);

inspectOpacityPanel.add(inspectOpacityLabelPanel);
inspectOpacityPanel.add(inspectOpacityImagePanel);

inspectOpacityLabelPanel.add(tools.makeLabel(inspectLocationLabels.opacityPoint, instructionLabelStyle));
inspectOpacityImagePanel.add(pointOpacitySlider);

inspectCenterPanel.add(inspectCenterLabelPanel);
inspectCenterPanel.add(centerPointButton);

inspectCenterLabelPanel.add(tools.makeLabel(inspectLocationLabels.centerPoint, instructionLabelStyle));

inspectReducerPanel.add(inspectReducerLabelPanel);
inspectReducerPanel.add(makeSelect(reduceDict, changeReduce));

inspectReducerLabelPanel.add(tools.makeLabel(inspectLocationLabels.reduceCollection, instructionLabelStyle));

inspectValuePanel.add(inspectChartPanel);
inspectValuePanel.add(inspectLegendPanel);
inspectLegendPanel.add(tools.makeGradientLegend(config.vis));

// conditions in a region layout
// -----------------------------

var conditionsRegionLabels = {
  bufferPoint: "Buffer point (m)",
  opacityBuffer: "Buffer opacity",
};

conditionRegionPanel.add(conditionOpacityPanel);
conditionRegionPanel.add(conditionBufferPanel);
conditionRegionPanel.add(conditionHistogramPanel);

conditionOpacityPanel.add(conditionOpacityLabelPanel);
conditionOpacityPanel.add(conditionOpacityImagePanel);

conditionBufferPanel.add(conditionBufferLabelPanel);
conditionBufferPanel.add(conditionBufferImagePanel);

conditionBufferLabelPanel.add(tools.makeLabel(conditionsRegionLabels.bufferPoint, instructionLabelStyle));
conditionBufferImagePanel.add(bufferSlider);

conditionOpacityLabelPanel.add(tools.makeLabel(conditionsRegionLabels.opacityBuffer, instructionLabelStyle));
conditionOpacityImagePanel.add(regionOneOpacitySlider);

// reduce conditions in a region layout
// ------------------------------------

var reduceConditionsLabels = {
    regionReduce: "Reduce values in region",
};

reduceRegionPanel.add(reduceConditionsRegionPanel);
reduceConditionsRegionPanel.add(reduceConditionsRegionLabelPanel);
reduceConditionsRegionPanel.add(makeSelect(reduceDict, changeRegionReduce));

reduceRegionPanel.add(reduceConditionsRegionChartPanel);

reduceConditionsRegionLabelPanel.add(tools.makeLabel(reduceConditionsLabels.regionReduce, instructionLabelStyle));

// condition time layout

var conditionTimeLabels = {
   opacityBuffer: "Opacity of red buffer",
   bufferPoint: "Red buffer size (m)",
};

conditionTimePanel.add(conditionTimeChartPanel);
conditionTimePanel.add(conditionTimeOpacityPanel);
conditionTimePanel.add(conditionTimeBufferPanel);

conditionTimeOpacityPanel.add(conditionTimeOpacityLabelPanel);
conditionTimeOpacityPanel.add(conditionTimeOpacityImagePanel);

conditionTimeBufferPanel.add(conditionTimeBufferLabelPanel);
conditionTimeBufferPanel.add(conditionTimeBufferImagePanel);

conditionTimeOpacityLabelPanel.add(tools.makeLabel(conditionTimeLabels.opacityBuffer, instructionLabelStyle));
conditionTimeOpacityImagePanel.add(regionTwoOpacitySlider);

conditionTimeBufferLabelPanel.add(tools.makeLabel(conditionTimeLabels.bufferPoint, instructionLabelStyle));
conditionTimeBufferImagePanel.add(bufferSlider2);

// threshold panel layout
// ----------------------

var thresholdLabels = {
 legendGradientTitle: "Brightness Value\n(percent of maximum)",
 thresholdValue: "Threshold value",
  thresholdButtonLabel: "Make threshold layer",
  layerOpacity: "Layer opacity",
  thresholdLegendLabel: 'Threshold map key',
  threshold0Label: "Less than or equal to threshold value",
  threshold1Label: "Greater than threshold value"
};

thresholdPanel.add(classifyGradientLegendPanel);
thresholdPanel.add(classifyValuePanel);
thresholdPanel.add(classifyUpdatePanel);
thresholdPanel.add(classifyOpacityPanel);
thresholdPanel.add(classifyThresholdLegendPanel);

classifyGradientLegendPanel.add(classifyGradientLegendLabelPanel);
classifyGradientLegendPanel.add(classifyGradientLegendImagePanel);

classifyValuePanel.add(classifyValueLabelPanel);
classifyValuePanel.add(classifyValueImagePanel);

classifyUpdatePanel.add(classifyUpdateLabelPanel);
classifyUpdatePanel.add(thresholdButton);

classifyOpacityPanel.add(classifyOpacityLabelPanel);
classifyOpacityPanel.add(classifyOpacityImagePanel);

classifyGradientLegendLabelPanel.add(tools.makeLabel(thresholdLabels.legendGradientTitle, legendLabelStyle));
classifyGradientLegendImagePanel.add(tools.makeGradientLegend(config.vis));

classifyValueLabelPanel.add(tools.makeLabel(thresholdLabels.thresholdValue, instructionLabelStyle));
classifyValueImagePanel.add(thresholdSlider);

classifyUpdateLabelPanel.add(tools.makeLabel(thresholdLabels.thresholdButtonLabel, instructionLabelStyle));

classifyOpacityLabelPanel.add(tools.makeLabel(thresholdLabels.layerOpacity, instructionLabelStyle));
classifyOpacityImagePanel.add(thresholdOpacitySlider);

classifyThresholdLegendPanel.add(tools.makeLegend(thresholdLabels.thresholdLegendLabel, thresholdPalette,
  [thresholdLabels.threshold0Label, thresholdLabels.threshold1Label]));

// compare snapshot layout
// -----------------------

var snapshotLabels = {
  snapshotT1Select: "Select a start and end time for a first layer",
  snapshotT2Select: "Select a start and end time for a second layer",
  startDateLabel: "Start date on or after 1992-01-01",
  endDateLabel: "End date on or before 2014-01-01",
  snapshotLabel0: "Always dark",
  snapshotLabel1: "Became dark",
  snapshotLabel10: "Became light",
  snapshotLabel11: "Always light",
  snapshotLegendLabel: 'Change key',
  layerOpacity: "Layer opacity",
  updateLabel: "Compare snapshots"
};

compareSnapPanel.add(tools.makeLabel(snapshotLabels.snapshotT1Select, instructionLabelStyle));
compareSnapPanel.add(startDateOnePanel);
compareSnapPanel.add(endDateOnePanel);
compareSnapPanel.add(tools.makeLabel(snapshotLabels.snapshotT2Select, instructionLabelStyle));
compareSnapPanel.add(startDateTwoPanel);
compareSnapPanel.add(endDateTwoPanel);
compareSnapPanel.add(snapshotUpdatePanel);
compareSnapPanel.add(snapshotOpacityPanel);
compareSnapPanel.add(tools.makeLegend(snapshotLabels.snapshotLegendLabel, snapshotPalette,
  [snapshotLabels.snapshotLabel0,
  snapshotLabels.snapshotLabel1,
  snapshotLabels.snapshotLabel10,
  snapshotLabels.snapshotLabel11]));

startDateOnePanel.add(makeTimeWindow(config.filterStart1, changeStart1));
startDateOnePanel.add(tools.makeLabel(snapshotLabels.startDateLabel, instructionLabelStyle));
endDateOnePanel.add(makeTimeWindow(config.filterEnd1, changeEnd1));
endDateOnePanel.add(tools.makeLabel(snapshotLabels.endDateLabel, instructionLabelStyle));

startDateTwoPanel.add(makeTimeWindow(config.filterStart2, changeStart2));
startDateTwoPanel.add(tools.makeLabel(snapshotLabels.startDateLabel, instructionLabelStyle));
endDateTwoPanel.add(makeTimeWindow(config.filterEnd2, changeEnd2));
endDateTwoPanel.add(tools.makeLabel(snapshotLabels.endDateLabel, instructionLabelStyle));

snapshotOpacityPanel.add(snapshotOpacityLabelPanel);
snapshotOpacityPanel.add(snapshotOpacityImagePanel);

snapshotOpacityLabelPanel.add(tools.makeLabel(snapshotLabels.layerOpacity, instructionLabelStyle));
snapshotOpacityImagePanel.add(snapshotOpacitySlider);

snapshotUpdatePanel.add(snapshotUpdateLabelPanel);
snapshotUpdatePanel.add(snapshotButton);

snapshotUpdateLabelPanel.add(tools.makeLabel(snapshotLabels.updateLabel, instructionLabelStyle));



// classifyThresholdLegendPanel.add(tools.makeLegend(thresholdLabels.thresholdLegendLabel, thresholdPalette,
//   [thresholdLabels.threshold0Label, thresholdLabels.threshold1Label]));


// =======
// credits
// =======

var creditStyle = {
  fontSize: '10px',
  fontFamily: font,
  color: 'black',
  padding: '10px',
  backgroundColor: background,
  whiteSpace: 'pre'
};

var credits = ui.Label({
  value: "Jeff Howarth, Geography Dept, Middlebury College ",
  style: creditStyle
});

sidePanel.add(credits);


// update widgets
// ==============

function render() {
  drawMap();
  showPointOnMap();
  showRegionOneOnMap();
  showRegionTwoOnMap();
  conditionAtPoint();
  reducerValueRegion();
  makeChart();
  makeChangeChart();
  // print(config);
  // print(map.getCenter());
}

var getIt = function() {
  print(map.getCenter());
};

map.onChangeCenter(getIt);



render();
