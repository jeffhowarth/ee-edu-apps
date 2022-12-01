//  NAME:     Global forest loss app
//  AUTHOR:   Jeff Howarth
//  DATE:     12/01/2022

//  ----------------------------------------------------------------------------
//  1. Initialize layout
//  ----------------------------------------------------------------------------

//  Initialize side panel. Define width as 20%.
//  Name the variable: side_panel

var side_panel = ui.Panel({
  style: {
    width: '20%'
  }
});

//  Initialize a map widget for the left map.
//  Set basemap to SATELLITE.
//  Name the variable: left_map

var left_map = ui.Map()
  .setOptions('SATELLITE');

//  Initialize a map widget for the right map.
//  Set basemap to SATELLITE.
//  Name the variable: right_map.

var right_map = ui.Map()
  .setOptions('SATELLITE');

//  Initialize a map linker widget and link left_map and right_map.
//  Name the variable: map_linker

var map_linker = ui.Map.Linker([left_map, right_map]);

//  Initialize a split panel widget to hold the two linked maps.
//  Define the orientation as 'horizontal' and wipe as true.
//  Name the variable: split_panel

var split_panel = ui.SplitPanel({
  firstPanel: map_linker.get(0),
  secondPanel: map_linker.get(1),
  orientation: 'horizontal',
  wipe: true,
  // style: {stretch: 'both'}
  }
);

//  Clear root.
//  Then add side panel and split panel to root.

ui.root.clear();
ui.root.add(side_panel).add(split_panel);

//  ----------------------------------------------------------------------------
//  2. Initialize and add widgets to the side panel.
//  ----------------------------------------------------------------------------

//  Initialize style parameters for title labels.
//  Name the variable: title_style

var title_style = {
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '4px',
  }
;

//  Initialize a label widget for the title and apply title_style.
//  Name the variable: title

var title = ui.Label({
  value: 'Global Forest Loss Explorer',
  style: title_style
  // targetUrl,
  // imageUrl
  }
);

//  Initialize style parameters for instructions.
//  Name the variable: instructions_style

var instructions_style = {
    fontSize: '14px',
    padding: '4px',
  }
;

//  Initialize a label widget for instructions and apply instructions_style.
//  Name the variable: chart_instructions

var chart_instructions = ui.Label({
  value: 'Click on the left map (the one with the black base layer) to select a region for charting forest loss by year.',
  style: instructions_style,
  // targetUrl,
  // imageUrl
  }
);

//  Initialize a panel widget to put the chart.
//  Name the variable: chart_panel

var chart_panel = ui.Panel();

//  Define style parameters for region labels.
//  Name the variable: region_style

var region_style = {
  fontSize: '12px',
  padding: '4px',
  backgroundColor: 'yellow'
};

//  Initialize label widget for level 1 name and apply style parameters.
//  Name the variable: a1_label

var a1_label = ui.Label({
  style: region_style
});

//  Initialize label widget for level 0 name and apply style parameters.
//  Name the variable: a0_label

var a0_label = ui.Label({
  style: region_style
});

//  Define style parameters for credits.
//  Name the variable: credits_style

var credits_style = {
  fontSize: '10px',
  padding: '4px',
  whiteSpace: 'pre'
  }
;

//  Initialize label widget for credits and apply credits style.
//  Name the variable: credits

var credits = ui.Label({
  value: 'Jeff Howarth\nGeography Department\nMiddlebury College',
  style: credits_style,
  targetUrl: 'https://jeffhowarth.github.io/'
  }
);

//  Add widgets to the side_panel.

side_panel
  .add(title)
  .add(chart_instructions)
  .add(chart_panel)
  .add(credits)
;

//  ----------------------------------------------------------------------------
//  3. Make and add image layers for left map.
//  ----------------------------------------------------------------------------

//  Construct image from address: "UMD/hansen/global_forest_change_2021_v1_9"
//  Name the output: dataset

var dataset = ee.Image('UMD/hansen/global_forest_change_2021_v1_9');

//  Threshold image so that land is 1 and everything else is 0
//  Name the output: land_mask

var land_mask = dataset.select('datamask').eq(1);

//  Add land mask as layer.
//  Make land 'black' and not land 'DarkSlateGray'.
//  Name the layer 'land'.

left_map.addLayer(land_mask, {palette: ['DarkSlateGray', 'Black']}, 'Land');

//  Create viz parameters for 'treecover2000' band.
//  Display range from 0 to 100.
//  Use 'black' to display min and '#00992B' to display max.
//  Name the variable: tree_viz

var tree_viz = {
  bands: ['treecover2000'],
  min: 0,
  max: 100,
  palette: ['black', '#00992B']
};

//  Add dataset to map as a layer and apply land_mask and tree_viz.
//  Name the layer 'tree cover' and make not shown by default.

left_map.addLayer(dataset.updateMask(land_mask), tree_viz, 'tree cover',0);

//  Define the loss palette. (Give this to them).

var loss_palette = [
  '#19faaf',
  '#4ff398',
  '#6cec81',
  '#82e46c',
  '#95dc57',
  '#a5d344',
  '#b4ca32',
  '#c2c020',
  '#cfb610',
  '#daab04',
  '#e59f06',
  '#ef9313',
  '#f78620',
  '#fd782d',
  '#ff693a',
  '#ff5a47',
  '#ff4b55',
  '#ff3b63',
  '#ff2b72',
  '#fb1d81',
  '#f11590',
  '#e5179f'
  ]
;

//  Define viz parameters for 'lossyear' band
//  Display range from 0 to 21 and call loss_palette.
//  Name the variable: loss_viz.

var loss_viz = {
  bands: ['lossyear'],
  min: 0,
  max: 21,
  palette: loss_palette
};

//  Add dataset as layer to map and apply loss_viz.
//  Name the layer 'tree loss year' and make shown by default.

left_map.addLayer(dataset, loss_viz, 'tree loss year');


//  ----------------------------------------------------------------------------
//  4. Make and add image layers for the right map.
//  ----------------------------------------------------------------------------

//  Select swir2, nir, and red bands from the last year and rename SWIR2, NIR, and Red.
//  Name the variable: last_composite.

var last_composite = dataset
  .select(['last_b70', 'last_b40', 'last_b30'], ['SWIR2', 'NIR', 'Red']);

//  Add last_composite as a layer to the map and apply land_mask as a mask.
//  Display as a SWIR2 false color composite with display range from 0 to 100.
//  Name the layer 'Last image' and make shown by default.

right_map.addLayer(last_composite.updateMask(land_mask), {min:0, max:100}, 'Last image',1);

//  Compute the normalized difference in vegetation index (NDVI) with the 'NIR' and 'Red' bands from the last_composite.
//  Name the variable: last_ndvi.

var last_ndvi = last_composite.normalizedDifference(['NIR', 'Red']);

//  Load the community palettes from 'users/gena/packages:palettes'.
//  Name the variable: palettes.

var palettes = require('users/gena/packages:palettes');

//  Define viz parameters for the NDVI layer.
//  Display the colorbrewer.PRGn[11] community palette stretched from -0.8 to 0.8.
//  Name the variable: ndvi_viz

var ndvi_viz = {
  min: -0.8,
  max: 0.8,
  palette: palettes.colorbrewer.PRGn[11]
};

//  Add last_ndvi as a layer and apply the land_mask and ndvi_viz.
//  Name the layer 'Last ndvi' and do not show layer by default.

right_map.addLayer(last_ndvi.updateMask(land_mask), ndvi_viz, 'Last ndvi',0);

//  Compute the normalized burn ratio from last_composite.
//  Name the variable: last_nbr

var last_nbr = last_composite.normalizedDifference(['NIR', 'SWIR2']);

//  Define viz paramters for the normalized burn ratio.
//  Apply the colorbrewer.BrBG[11] palette and stretch from -0.8 to 0.8.
//  Name the variable: nbr_viz

var nbr_viz = {
  min: -0.8,
  max: 0.8,
  palette: palettes.colorbrewer.BrBG[11]
};

//  Add last_nbr as a layer to the map and apply land_mask as a mask and nbr_viz.
//  Name the layer 'Last burn ratio' and make not shown by default.

right_map.addLayer(last_nbr.updateMask(land_mask), nbr_viz, 'Last burn ratio',0);

//  ----------------------------------------------------------------------------
//  5. Make reference feature layers for both maps.
//  ----------------------------------------------------------------------------

//  Construct a feature collection from address: "FAO/GAUL/2015/level1".
//  Name the variable: regions

var regions = ee.FeatureCollection("FAO/GAUL/2015/level1");

//  Define style parameters for region layer.
//  Name the variable: style_regions

var style_regions = {
  color: 'white',               //  Stroke (perimeter) color
  width: 0.5,                   //  Stroke (perimeter) width
  fillColor: 'FFFFFF00'        //   Fill (interior) color
};

//  Initialize map layer as a widget.
//  Call style_regions with .style method.
//  Label the layer 'regions_layer'.

var regions_layer = ui.Map.Layer(
  regions.style(style_regions),       //  Call style parameters with .style method.
  {},                                 //  Viz parameters as empty object.
  'Regions',                          //  Name of the layer (string).
  true                                //  Show by default.
);

//  Add map layer widget to left map.

left_map.add(regions_layer);


//  Write a function to make map layer as a widget.

var makeLayer = function(fc, style, name, show) {
  return ui.Map.Layer(fc.style(style), {}, name, show);
};

//  Apply function to add regions layer as a widget to the right map.

right_map.add(makeLayer(regions, style_regions, 'Regions', 1));

//  Construct a feature collection from address: "WCMC/WDPA/current/polygons"
//  Filter the feature collection for features where the 'STATUS' is not 'proposed'
//  And where the 'IUCN_CAT' is not 'VI'.
//  Name the variable: protected_lands

var protected_lands = ee.FeatureCollection("WCMC/WDPA/current/polygons")
  .filter(ee.Filter.neq('STATUS', 'proposed'))
  .filter(ee.Filter.neq('IUCN_CAT', 'VI'))
  ;

//  Define style parameters for the protected lands layer.
//  Name the variable: pro_lands_style

var pro_lands_style = {
  color: '#17E551',
  fillColor: 'FFFFFF00',
  width: 1
};

//  Call makeLayer() to add protected lands with pro_lands_style to both left and right maps.
//  Label the layers 'Protected Lands' and do not show by default.

left_map.add(makeLayer(protected_lands, pro_lands_style, 'Protected Lands', 0));
right_map.add(makeLayer(protected_lands, pro_lands_style, 'Protected Lands', 0));

//  ----------------------------------------------------------------------------
//  6. Prepare image to chart change over time.
//  ----------------------------------------------------------------------------

// Write a function to give a feature a property named 'tag' and a specified value.

var tag_features = function(feature) {
  return feature
    .set(
      {tag: 1}  // Property name and specified value
    );
  }
;

// Apply function to all features in a feature collection (fc).

var tagged_fc = protected_lands.map(tag_features);         // Change fc to the name of feature collection.

// Create a function to convert feature collection to binary image.

var makeImage = function(fc, property) {
  return ee.Image()                                 //  Create empty image
    .byte()                                         //  Store as byte
    .paint(fc, property);                           //  Paint values at locations from property of feature collection (fc).
  }
;

// Use function to convert a feature collection to an image.
//  Name the variable: pro_binary

var pro_binary =                    // Name output variable
  makeImage(                        // Call function from above
    tagged_fc,                      // feature collection
    'tag'                           // property of fc to use as pixel values
  )
;

//  Create image with a band stack to chart.
//  Last band must be integers that define classes.

var loss = ee.Image.pixelArea().multiply(0.000001)
  .addBands(ee.Image.pixelArea().multiply(0.000001).updateMask(pro_binary))
  .addBands(dataset.select(['lossyear'])
  );

//  ----------------------------------------------------------------------------
//  7. Select a study region and center map on it.
//  ----------------------------------------------------------------------------

//  Define poi.
//  Name the variable: poi

var poi = ee.Geometry.Point([-56.64116785106647, -13.042136580282266]);

//  Define study region.
//  Name the variable: study_region

var study_region = regions
  .filterBounds(poi);

//  Center the left map on the selected study region at zoom level 6.

left_map.centerObject(study_region, 6);

//  Define style parameters for selected region.
//  Name the variable: style_selected_region

var style_selected_region = {
  color: 'yellow',
  fillColor: 'FFFFFF00',
  width: 1
};

//  Add the selected study region as layer to both left and right maps and apply syle parameters.

left_map.add(makeLayer(study_region, style_selected_region, 'Selected region',1));
right_map.add(makeLayer(study_region, style_selected_region, 'Selected region',1));

//  Print region names to labels (initialized previously).

var cart = require('users/jhowarth/eePrimer:modules/cart.js');

cart.printFeaturePropertyLabel(study_region, 'ADM1_NAME', a1_label);
cart.printFeaturePropertyLabel(study_region, 'ADM0_NAME', a0_label);

//  Add labels to the chart panel.

chart_panel.add(a1_label).add(a0_label);

//  ----------------------------------------------------------------------------
//  8. Chart change over time in selected region and add to side panel.
//  ----------------------------------------------------------------------------

//  Define labels for the integer clases.
//  Name the variable: loss_labels

var loss_labels = [
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021'
  ]
;

//  Define chart computation parameters.
//  Name the variable: loss_chart_params

var loss_chart_params = {
  image: loss,                          //  Image stack with
  classBand: 'lossyear',                //  Band that defines nominal zones.
  region: study_region,                //  Cutter feature
  reducer: ee.Reducer.sum(),            //  Reducer for zonal statistic
  scale: 900,                           //  Scale for reducer
  classLabels: loss_labels,             //  Labels for values in dough band
  xLabels: [                            //
    'loss in whole region',
    'loss in protected areas'
    ]
  }
;

//  Define chart style parameters.
//  Name the variable: loss_chart_style

var loss_chart_style = {
  colors: loss_palette,
  legend: {
    position: 'none'
    },
  vAxis: {
    title: 'area (sq km)',
    titleTextStyle: {italic: true, bold: false}
    },
  }
;

//  Make the chart with the computation parameters and set the style options.
//  Name the variable: chart

var chart = ui.Chart.image.byClass(loss_chart_params)
  .setOptions(loss_chart_style);

//  Add the chart to the chart panel

chart_panel.add(chart);

//  ----------------------------------------------------------------------------
//  9. Write functions to make app interactive.
//  ----------------------------------------------------------------------------

//  Initialize a configuration object to store temporary variables.
//  Name the variable: config

var config = {};

// Write a function to store study region in config object.
//  Name the variable: makeStudyRegion

var makeStudyRegion = function() {
  config.region = regions.filterBounds(config.poi);
};

//  Write a function that returns a chart using study region in config object.
//  Name the variable: makeLossChart

var makeLossChart = function() {

  //  Define chart computation parameters.

  var loss_chart_params = {
    image: loss,                          //  Image stack with
    classBand: 'lossyear',                //  Band that defines nominal zones.
    region: config.region,                //  Cutter feature
    reducer: ee.Reducer.sum(),            //  Reducer for zonal statistic
    scale: 900,                           //  Scale for reducer
    classLabels: loss_labels,             //  Labels for values in dough band
    xLabels: [                            //
      'loss in whole region',
      'loss in protected areas'
      ]
    }
  ;

  //  Define chart style parameters.

  var loss_chart_style = {
    colors: loss_palette,
    legend: {
      position: 'none'
      },
    vAxis: {
      title: 'area (sq km)',
      titleTextStyle: {italic: true, bold: false}
      },
    }
  ;

  return ui.Chart.image.byClass(loss_chart_params)
    .setOptions(loss_chart_style);
};

//  Write a function to update the chart based on study region from config object.
//  Name the variable: updateChart


var updateChart = function() {
  chart_panel.clear();                                                        // Clear widgets from the panel.
  cart.printFeaturePropertyLabel(config.region, 'ADM1_NAME', a1_label);       // Print admin1 property to label.
  cart.printFeaturePropertyLabel(config.region, 'ADM0_NAME', a0_label);       // Print admin0 property to label.
  chart_panel.add(a1_label).add(a0_label);                                    // Add labels to chart panel
  chart_panel.add(makeLossChart());                                           // Add makeLossChart() to panel
};

//  Write a function to update the map with study region from config object.
//  Name the variable: updateMap

var updateMap = function() {
  left_map.centerObject(config.region, 6);
  left_map.layers().set(5, makeLayer(config.region, style_selected_region, 'Selected region',1));
  right_map.layers().set(5, makeLayer(config.region, style_selected_region, 'Selected region',1));
};

//  Write a function that adds the clicked point to the config object
//  and updates the chart and map based on the new study region.
//  Name the variable: handleMapClick

var handleMapClick = function(coordinates) {
  config.poi = ee.Geometry.Point([coordinates.lon, coordinates.lat]);
  makeStudyRegion();
  updateChart();
  updateMap();
};

//  Call the function when user clicks the left map.

left_map.onClick(handleMapClick);
