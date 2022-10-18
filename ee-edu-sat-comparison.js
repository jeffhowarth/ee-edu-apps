// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Title:   ee-edu-sat-comparison.js
// Author:  Jeff Howarth
// Date:    10/17/2022
// Purpose: To make quick comparisons between S2, L8, and MODIS.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var widgets = require('users/jhowarth/eePrimer:modules/widgets.js');
var image_tools = require('users/jhowarth/eePrimer:modules/image_tools.js');

// --------------------------------------
// initialize layout
// --------------------------------------

// Initialize panel.

var panel = ui.Panel(
  {style: {width: '30%'}});

// Initialize map.

var map = ui.Map();

//initialize splitPanel

var split_panel =  ui.SplitPanel({
    firstPanel: panel,
    secondPanel: map
    });

ui.root.clear();
ui.root.add(split_panel);

// --------------------------------------
// Configuration
// --------------------------------------

var config = {
  title: 'Satellite comparison',
  subtitle: 'Sentinel 2, Landsat 8, MODIS Terra',
  urlTitle: '',
  S2: ee.ImageCollection('COPERNICUS/S2_SR'),
  L8: ee.ImageCollection('LANDSAT/LC08/C02/T1_L2'),
  MODIS: ee.ImageCollection("MODIS/061/MOD09GA"),
  poi: map.getCenter(),
  filterStart: '2020-06-01',
  filterEnd: '2020-08-01',
  cloudPercent: 20,
  zoom: 10,
  baseMap: 'HYBRID',
  viz_S2: {
    min: 0.0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2'],
    },
  viz_L8: {
    bands: ['SR_B4', 'SR_B3', 'SR_B2'],
    min: 0.0,
    max: 0.3,
    },
  viz_MODIS: {
    bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    min: 0.0,
    max: 0.3,
    },
  label_S2: 'Sentinel 2',
  label_L8: 'Landsat 8',
  label_MODIS: 'MODIS Terra'
};

// --------------------------------------
// Function to make S2 images
// --------------------------------------

var make_S2_image = function(collection) {
  return collection
    .filterBounds(config.poi)                         // filter by location
    .filterDate(config.filterStart, config.filterEnd)             // filter by time
    // Pre-filter to get less cloudy granules.
    .filter(                                          // filter
      ee.Filter.lt(                                   // criteria
        'CLOUDY_PIXEL_PERCENTAGE',                    // property
        config.cloudPercent))                         // value
    .map(image_tools.cloudMask_S2)                          // apply cloud mask to all images
    .median()
    .multiply(0.0001);                                   // scale by division
  };

// --------------------------------------
// Functions to make L8 images
// --------------------------------------

var make_L8_image = function(collection) {
  var image = collection
    .filterBounds(config.poi)
    .filterDate(config.filterStart, config.filterEnd)
    .filter(                                          // filter
      ee.Filter.lt(                                   // criteria
        'CLOUD_COVER',                                 // property
        config.cloudPercent))
    .map(image_tools.scale_L89)
    .map(image_tools.cloudMask_L89)
    .median();
  return image;
};

// --------------------------------------
// Functions to make L8 images
// --------------------------------------

var make_MODIS_image = function(collection) {
  return collection
    .filterBounds(config.poi)
    .filterDate(config.filterStart, config.filterEnd)
    .map(image_tools.cloudMask_MODIS)
    .median()
    .multiply(0.0001);
};


// ----------------------------------------------
// Make labels
// ----------------------------------------------

var styles = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold'
    },
  subTitle: {
    fontSize: '18px',
    // color: '#478EC9',
    whiteSpace: 'pre'
    // backgroundColor: background
    },
  instruction: {
    fontSize: '14px',
    // color: '#478EC9',
    whiteSpace: 'pre'
    // backgroundColor: background
    },
  credits: {
    fontSize: '10px',
    whiteSpace: 'pre',
    color: '#999999',
    margin: '1px 8px 1px 8px'
  }
};


// // Style for instructions

// var instructionStyle = {
//   fontSize: '14px',
//   color: '#478EC9',
//   whiteSpace: 'pre'
//   // backgroundColor: background
// };

var makeInstructions = function(stepLabel) {
  var instructionPanel = ui.Panel();
  var instructionLabel = ui.Label(
    {
    value: stepLabel,
    style: styles.instruction
    }
  );
  return instructionPanel.add(instructionLabel);
};


// ----------------------------------------------
// Add layers to map
// ----------------------------------------------

map.centerObject(config.poi, config.zoom);
map.setOptions(config.baseMap);

// Add MODIS image
map.addLayer(make_MODIS_image(config.MODIS), config.viz_MODIS, config.label_MODIS,0);

// Add L8 image

map.addLayer(make_L8_image(config.L8), config.viz_L8, config.label_L8,0);

// Add S2 image
map.addLayer(make_S2_image(config.S2), config.viz_S2, config.label_S2,0);


// ----------------------------------------------
// make time window widgets
// ----------------------------------------------

var time_panel = ui.Panel(
  {
    style:
    {
      width: '80%',
      shown: true
    }
  }
)
;

var start_end_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('horizontal'),
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;


var changeStart = function(text) {
  config.filterStart = String(text);
  print(config.filterStart);
};

var changeEnd = function(text) {
  config.filterEnd = String(text);
  print(config.filterEnd);
};

var makeTimeWindow = function(date, fun) {
  var timeDict =  {
    placeholder: date,
    onChange: fun
    };
  return ui.Textbox(timeDict);
};

start_end_panel
  .add(makeTimeWindow(config.filterStart, changeStart))
  .add(makeTimeWindow(config.filterEnd, changeEnd))
;

time_panel
  .add(makeInstructions('Select two dates between 2019-01-01 and today.\nThen click the DRAW button.'))
  .add(start_end_panel)
  .add(makeInstructions('If the layer panel appears red while drawing,\nthen please try to widen your time window and\nclick the DRAW button again.'))
;


// --------------------------------------
// Button to draw layers
// --------------------------------------

// Button to filter collection by map center and draw layers

var centerButton = ui.Button(
  {
  label: 'draw scene at map center',
  onClick: function() {
    config.poi = map.getCenter();
    map.layers().set(
      0,
      ui.Map.Layer(
        make_MODIS_image(config.MODIS),
        config.viz_MODIS,
        'MODIS Terra',
        0)
      );
    map.layers().set(
      1,
      ui.Map.Layer(
        make_L8_image(config.L8),
        config.viz_L8,
        'Landsat 8',
        0)
      );
    map.layers().set(
      2,
      ui.Map.Layer(
        make_S2_image(config.S2),
        config.viz_S2,
        'Sentinel 2',
        0)
      );
    }
  }
);


// --------------------------------------
// Title
// --------------------------------------

var title = ui.Label( {
  value: config.title,
  style: styles.title,
  // targetUrl: config.urlTitle,
  // imageUrl:  {}
  }
)
;

var subtitle = ui.Label( {
  value: config.subtitle,
  style: styles.subTitle,
  // targetUrl: config.urlTitle,
  // imageUrl:  {}
  }
)
;

// --------------------------------------
// Make credits.
// --------------------------------------

// Make credits panel.

var credits_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('vertical'),
    style:
    {
      width: '95%',
      shown: true,
    }
  }
)
;

var makeLabel = function(title, style, link) {
  return ui.Label({
    value: title,
    style: style,
    targetUrl: link
  });
};

credits_panel
  .add(makeLabel(
    'CREDITS',
    styles.credits
    )
  )
  .add(makeLabel(
    'Jeff Howarth, Geography Dept, Middlebury College',
    styles.credits,
    'https://jeffhowarth.github.io/eeprimer/'
    )
  )
  .add(makeLabel(
    'Code for this app',
    styles.credits,
    'https://github.com/jeffhowarth/ee-edu-apps/blob/main/ee-edu-sat-comparison.js'
    )
  )
;

// --------------------------------------
// Compose panel
// --------------------------------------

panel.add(title)
  .add(subtitle)
  .add(time_panel)
  .add(centerButton)
  .add(credits_panel)
  ;
