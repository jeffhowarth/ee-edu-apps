// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// AUTHOR:      Jeff Howarth
// UPDATED:     Oct 7, 2022
// PURPOSE:     For education:
//              to explore relationships of LST and landcover
//              and to apply stretch enhancements to adjust for
//              for seasonal and geographical variations.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var LandsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');

var palettes = require('users/gena/packages:palettes');

var cart = require('users/jhowarth/eePrimer:modules/cart.js');

// --------------------------------------
// initialize layout
// --------------------------------------

// Initialize panel.

var panel = ui.Panel(
  {style:
    {width: '30%'}
  }
);

// Initialize map.

var map = ui.Map();

//initialize splitPanel

var split_panel =  ui.SplitPanel
  (
    {
      firstPanel: panel,
      secondPanel: map
    }
  )
;

// ----------------------------------------------
// make time panels
// ----------------------------------------------

var time_panel = ui.Panel(
  {
    style:
    {
      width: '100%',
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


// Make histogram panel

var histogram_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('vertical'),
    // widgets: []
    style:
      {
      width: '80%',
      shown: true
      }
    }
  )
;

ui.root.clear();
ui.root.add(split_panel);


// style dictionary for labels

var styles = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold'
    },
  subTitle: {
    fontSize: '14px',
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


// Create instruction panels

var makeInstructions = function(stepLabel, styleType) {
  var instructionPanel = ui.Panel();
  var instructionLabel = ui.Label(
    {
    value: stepLabel,
    style: styleType
    }
  );
  return instructionPanel.add(instructionLabel);
};

// Create labels

var title = ui.Label( {
  value: 'Land surface temperature from Landsat 8',
  style: styles.title,
  targetUrl: {},
  // imageUrl:  {}
});

var top_instructions = ui.Label( {
  value: 'TO CHANGE MAPPED LOCATION:\n\nPan and zoom map, then click a location on the map.\nThis will update the LST layer and histogram.\nThe histogram reports values within the map window extent.',
  style: styles.subTitle,
  // targetUrl: {},
  }
)
;


// --------------------------------------
// config
// --------------------------------------

var config = {
  poi: ee.Geometry.Point([-73.040141,44.219350]),
  i: '',
  palette: palettes.colorbrewer.RdYlBu[11].reverse(),
  display_min: 50,
  display_max: 100,
  slider_min: -50,
  slider_max: 200,
  bands: 'LST',
  mission: 'L8',
  startDate: '2019-07-01',
  endDate: '2019-09-01',
  y_max: 150000,
  y_value: 150000,
  cloud_max: 50,
  cloud_value: 10,
  pixel_scale: 90,
  // buffer: 100,
  hist: '',
  extent: ee.Geometry.Polygon([
      [-73.73467706382011,43.76141045057328],
      [-72.34560493617987,43.76141045057328],
      [-72.34560493617987,44.67375535245419],
      [-73.73467706382011,44.67375535245419],
      [-73.73467706382011,43.76141045057328]
      ])
};


// Convert from Kelvin to Farenheit

var convert_k2f = function() {
  return  config.i            // input
   .median()                   // reduce image collection to image
  .subtract(273.15).multiply(9).divide(5).add(32)
  ;
};

var updateImage = function() {
  config.i = LandsatLST
    .collection
      (config.mission,                  // landsat collection
      config.startDate,           // start date
      config.endDate,           // end date
      config.poi         // poi to filter collection
      )
    .filter(ee.Filter.lt('CLOUD_COVER', config.cloud_value))
    ;
};

updateImage();


// When you click the map

map.onClick(function(coords) {
  config.poi = ee.Geometry.Point(coords.lon, coords.lat);
  config.extent = ee.Geometry.Rectangle(map.getBounds()),
  refresh();
  }
);


// Add layer to map

var updateRGB = function() {
  map.layers().set(
    0,
    ui.Map.Layer(config.i
      .median()
      .multiply(0.0000275).add(-0.2),
      {
        bands: ['SR_B4', 'SR_B3', 'SR_B2'],
        min:0,
        max:0.3
      },
      'Natural color composite',
      true
    )
  );
};

var updateMap = function() {
  map.layers().set(
    1,
    ui.Map.Layer(
      convert_k2f(config.i),
      {
        min: config.display_min,
        max: config.display_max,
        bands: config.bands,
        palette: config.palette
      },
      config.bands,
      true)
    );

};


// --------------------------------------
// time windows
// --------------------------------------

var changeStart = function(text) {
  config.startDate = String(text);
  refresh();
};

var changeEnd = function(text) {
  config.endDate = String(text);
  refresh();
};

var makeTimeWindow = function(date, fun) {
  var timeDict =  {
    placeholder: date,
    onChange: fun
    };
  return ui.Textbox(timeDict);
};

start_end_panel
  .add(makeTimeWindow(config.startDate, changeStart))
  .add(makeTimeWindow(config.endDate, changeEnd))
;


var today = new Date().toISOString().slice(0, 10);

// Cloud filter slider

// -------------------------------------
// cloud mask
// -------------------------------------

var cloud_filter_label = ui.Label(
    {
    value: 'Set max percent cloudy.',
    style: styles.instruction
    }
  );

var cloud_filter_slider = ui.Slider({
  min: 0,
  max: config.cloud_max,
  value: config.cloud_value,
  step: 5,
  style:
    {width: '50%'},
  onChange: function(value) {
    config.cloud_value = value;
    refresh();
  }
});

var cloud_filter_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [
      cloud_filter_label,
      cloud_filter_slider],
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;

// Configure time panel.

time_panel
  .add(makeInstructions(
    'TO CHANGE DATES:\n\nSelect a new start and end date.\nDates must be between 2019-01-01 and ' + today,
    styles.instruction))
  .add(start_end_panel)
  .add(makeInstructions(
    'If the layer panel appears red while drawing,\nthen please try to widen your time window (above)\nor increase the allowable percent of cloud cover (below).',
     styles.instruction))
  .add(cloud_filter_panel)
;


// --------------------------------------
// sliders
// --------------------------------------


var min_label = ui.Label(
    {
    value: 'Minimum display value',
    style: styles.instruction
    }
  );

var min_slider = ui.Slider({
  min: config.slider_min,
  max: config.slider_max,
  value: config.display_min,
  step: 5,
  style:
    {width: '50%'},
  onChange: function(value) {
    config.display_min = value;
    refresh();
  }
});

var min_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [
      min_label,
      min_slider],
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;

var max_label = ui.Label(
    {
    value: 'Maximum display value',
    style: styles.instruction
    }
  );

var max_slider = ui.Slider({
  min: config.slider_min,
  max: config.slider_max,
  value: config.display_max,
  step: 5,
  style:
    {width: '50%'},
  onChange: function(value) {
    config.display_max = value;
    refresh();
  }
});

var max_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [
      max_label,
      max_slider],
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;


// -------------------------------------
// y-axis
// -------------------------------------



var y_max_label = ui.Label(
    {
    value: 'Set max for y-axis.',
    style: styles.instruction
    }
  );

var y_max_slider = ui.Slider({
  min: 0,
  max: config.y_max,
  value: config.y_value,
  step: 250,
  style:
    {width: '50%'},
  onChange: function(value) {
    config.y_max = value;
    refresh();
  }
});

var y_max_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [
      y_max_label,
      y_max_slider],
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;




// --------------------------------------
// histogram
// --------------------------------------


// Import module for image processing.

var image_tools = require('users/jhowarth/eePrimer:modules/image_tools.js');


// Construct histogram chart.
var updateHistogram = function() {
  histogram_panel.clear();
  histogram_panel.add(image_tools.makeBoundedHistogram
      (
        config.extent,                              //  region (because image is unbounded)
        convert_k2f(config.i),                      //  use data from this image
        config.bands,                               //  select this band
        config.pixel_scale,                         //  use this scale (same as image)
        config.display_min,                         //  min value of x-axis
        config.display_max,                         //  max value of x-axis
        config.y_min,                               //  min value of y-axis
        config.y_max                                //  max value of y-axis
      )
    );
};

// --------------------------------------
// Make legend.
// --------------------------------------

// Make legend panel.

var legend_panel = ui.Panel(
  {
    layout: ui.Panel.Layout.flow('vertical'),
    style:
    {
      width: '95%',
      shown: true
    }
  }
)
;

// Function to update legend

var updateLegend = function() {
  legend_panel.clear();
  legend_panel.add(
    cart                                                     // module
      .makeGradientLegend(                                                // function
        {
          min: config.display_min,
          max: config.display_max,
          bands: config.bands,
          palette: config.palette
        },                                                       // viz parameters
        'AVERAGE SURFACE TEMP',                          // legend title
        'bottom-left'                                                     // position on map
      )
  );
};

updateLegend();


// --------------------------------------
// Make credits.
// --------------------------------------

// Make legend panel.

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
    'LST from L8 module by Sofia Ermida',
    styles.credits,
    'https://github.com/sofiaermida/Landsat_SMW_LST/blob/master/modules/Landsat_LST.js'
    )
  )
  .add(makeLabel(
    'Earth Engine community color palettes',
    styles.credits,
    'https://github.com/gee-community/ee-palettes'
    )
  )
  .add(makeLabel(
    'Code for this app',
    styles.credits,
    'https://github.com/jeffhowarth/ee-edu-apps/blob/main/ee-edu-lst-l8.js'
    )
  )
;



// --------------------------------------
// Configure map.
// --------------------------------------

map.setOptions('HYBRID');
map.centerObject(config.poi, 10);
map.style().set({cursor: 'crosshair'});




// -------------------------------------
// Panel composition
// -------------------------------------

panel
  .add(title)
  .add(legend_panel)
  .add(top_instructions)
  .add(time_panel)
  .add(histogram_panel)
  .add(min_panel)
  .add(max_panel)
  .add(y_max_panel)
  .add(credits_panel)
;

// REFRESH

var refresh = function() {
  updateImage();
  updateRGB();
  updateMap();
  updateHistogram();
  updateLegend();
};

refresh();
