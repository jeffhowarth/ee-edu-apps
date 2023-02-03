// Module for Foundations with Lights
// Jeff Howarth

/*
======================
Create Gradient Legend
======================

Creates a color bar thumbnail image for use in legend from the given color palette.

Call: var legend = makeGradientLegend(vis);
*/

var font = 'Lato, sans-serif';

exports.makeColorBarParams = function(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
};

exports.makeGradientLegend = function(vis) {
  var colorBar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: exports.makeColorBarParams(vis.palette),
    style: {stretch: 'horizontal', margin: '4px', padding: '4px', maxHeight: '24px'},
  });

// Create a panel with three numbers for the legend.
var legendLabels = ui.Panel({
  widgets: [
    ui.Label(vis.min, {margin: '4px 4px'}),
    ui.Label(
        (vis.max / 2),
        {margin: '4px 4px', textAlign: 'center', stretch: 'horizontal'}),
    ui.Label(vis.max, {margin: '4px 4px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
  });
return ui.Panel([colorBar, legendLabels]);
};

// javascript function to generate equal interval sequence of threshold values
exports.generateRange = function (min, max, step){
  var list = [];
  for(var i = min; i <= max; i += step){
     list.push(i);
  }
  return list;
};

// ======================
// Make qualitative legnd
// ======================

// to call this module
// var test = tools.makeLegend(layerName, palette, labels);


exports.makeRow = function(color, name) {
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        border: '1px solid black',
        padding: '10px 10px',
        margin: '4px 4px'
        }
      });
    var description = ui.Label({
      value: name,
      style: {
        margin: '4px 4px',
        fontSize: 10,
        fontFamily: font,
        }
      });
    return ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
      });
    };

exports.makeLegend = function(layerName, palette, labels) {
  var labelList = ee.List(labels);
  var labelLength = labelList.length();
  var legend = ui.Panel({
  style: {
    padding: '8px 15px'
    }
  });
  var legendTitle = ui.Label({
    value: layerName,
    style: {
      fontWeight: 'bold',
      fontSize: 12,
      fontFamily: font,
      margin: '4px 4px',
      padding: '4px 4px'
      }
    });
  legend.add(legendTitle);
  for (var i = 0; i < labelLength.getInfo(); i++) {
  legend.add(exports.makeRow(palette[i], labels[i]));
  }
  return legend;
};

// ===========
// Make panels
// ===========

exports.makePanel = function(style) {
  var panelStyle = {
    width: style.width,
    padding: style.padding,
    margin: style.margin,
    backgroundColor: style.backgroundColor,
    textAlign: style.textAlign,
    whiteSpace: style.whiteSpace,
    shown: style.shown
    };
  return ui.Panel({
    layout: ui.Panel.Layout.flow(style.direction),
    style: panelStyle});
  };

// Make labels to place on panels
// where
// text = text for the label
// style = call titleStyle or instructionStyle

exports.makeLabel = function(text, style) {
  var labelStyle =  {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: font,
    color: style.color,
    padding: style.padding,
    margin: style.margin,
    whiteSpace: style.whiteSpace
  };
  return ui.Label({
    value: text,
    style: labelStyle
  });
};

// Checkbox
// for style, call exports.titleStyle or exports.instructionStyle
// not sure if these styles actually work...

exports.makeCheckBox = function(label, style) {
  var checkStyle = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: font,
    color: style.color,
    padding: style.padding,
    margin: style.margin
    };
  var checkOptions = {
    label: label,
    value: false,
    disabled: false,
    style: checkStyle
    };
  return ui.Checkbox(checkOptions);
};

// check functions
// call these functions on check.onChange(function)
// to show a layer when user checks box
exports.showLayer = function(checked, layer, map) {
  map.layers().get(layer).setShown(checked);
};

// to show a panel when user checks box

exports.showPanel = function(checked, panel) {
  panel.style().set('shown', checked);
};
