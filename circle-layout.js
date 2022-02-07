
function circleLayout(words, radius, opts = {}) {

  let offset = opts.offset || { x: 0, y: 0 };
  let padding = opts.padding || 0;
  let fontName = opts.font || 'sans-serif';
  let fontSize = opts.fontSize || 10;
  let lineHeightScale = opts.lineHeightScale || 1.2;
  let lineHeight = opts.lineHeight || opts.fontSize * lineHeightScale;

  let result = fitToLineWidths
    (offset, radius - padding, words, fontSize, lineHeight, fontName);

  let excess = result.words.length;
  let blanks = result.text.filter(t => t.length <= 1).length;
  if (blanks > 2) console.warn('[WARN] ' + blanks + ' blank lines');
  if (excess) console.warn('[WARN] ' + excess + ' words not included');

  let lines = result.rects.map((r, i) =>
    ({ fontSize, bounds: r, text: result.text[i] }));
  // console.log(JSON.stringify(lines));

  return lines;
}

function bestCircleLayout(words, radius, opts = {}) {
  let offset = opts.offset || { x: 0, y: 0 };
  let padding = opts.padding || 0;
  let fontName = opts.font || 'sans-serif';
  let lineHeightScale = opts.lineHeightScale || 1.2;

  radius -= padding;
  let fontSize = radius / 4, result;
  do {
    fontSize *= .99;
    result = fitToLineWidths
      (offset, radius, words, fontSize, fontSize * lineHeightScale, fontName);
  }
  while (result.words.length);

  console.log('Computed fontSize:', fontSize);

  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

function fitToLineWidths(offset, radius, words, fontSize, lineHeight, fontName = 'sans-serif') {
  //console.log('fitToLineWidths', fontSize);
  let tokens = words.slice();
  let text = [], rects = lineWidths(offset, radius, lineHeight);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontName);
    if (!data) { // fail to fit any words
      text.push('');
      return;
    }
    text.push(data.text);
    tokens = data.words;
  });
  return { text, rects, words: tokens };
}

function lineWidths(offset, rad, lh) {
  let result = [];
  let num = Math.floor((rad * 2) / lh);
  for (let i = 0; i < num; i++) {
    let d = (i + 1) * lh - lh / 3; // ?
    let cl = chordLength(rad, d > rad ? d + lh : d);
    let x = offset.x - cl / 2;
    let y = offset.y - (rad - d);
    if (cl) {
      //console.log(i, d, d > r, cl);
      result.push([x, y, cl, lh]);
    }
  }
  return result;
}

function fitToBox(words, width, fontSize, fontName = 'sans-serif') {
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName)
  };
  if (line.width > width) return; // can't fit first word

  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName);
    if (line.width + nextWidth > width) {
      break; // done
    }
    line.text += next;
    line.width += nextWidth;
  }
  words = words.slice(i);
  if (RiTa.isPunct(words[0])) { // punct can't start a line
    line.text += words.shift();
  }
  return {
    words, text: RiTa.untokenize((line.text || '').split(' ')),
  };
}

// at distance 'd' from top of circle with radius 'rad'
function chordLength(rad, d) {
  return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

let context;
function measureWidth(text, fontSizePx = 12, fontName = font) {
  context = context || document.createElement("canvas").getContext("2d");
  context.font = fontSizePx + 'px ' + fontName;
  return context.measureText(text).width;
}